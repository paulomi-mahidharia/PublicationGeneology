package edu.neu.msproject.PulicationGeneology.service;

import edu.neu.msproject.PulicationGeneology.dao.SearchAuthorDao;
import edu.neu.msproject.PulicationGeneology.dao.SearchAuthorDaoImpl;
import edu.neu.msproject.PulicationGeneology.dao.SearchPaperDao;
import edu.neu.msproject.PulicationGeneology.dao.SearchPaperDaoImpl;
import edu.neu.msproject.PulicationGeneology.model.*;
import edu.neu.msproject.PulicationGeneology.util.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.*;

public class SearchServiceImpl implements SearchService {

    private SearchAuthorDao searchDao = new SearchAuthorDaoImpl();

    public static String buildPaperQuery(String query, Paper paper) {

        List<String> conditions = new ArrayList<String>();

        if (paper.getConferenceName() != null && !paper.getConferenceName().isEmpty()) {
            StringBuilder confNameString = new StringBuilder();
            String[] confNames = paper.getConferenceName().split(",");
            for (int i = 0; i < confNames.length; i++) {
                confNameString.append("'" + confNames[i].trim() + "'");
                if (i != confNames.length - 1) {
                    confNameString.append(",");
                }

            }
            conditions.add(PublicationUtil.publicationQuery("paper", confNameString.toString(), paper.isPublished()));
        }

        if (paper.getKeyword() != null && !paper.getKeyword().isEmpty()) {
            conditions.add(TitleUtil.titleQuery(paper.getKeyword(), "paper", paper.isContains()));
        }

        String yearResult = YearUtil.formYearQuery(paper.getOptions(), paper.getStartDate(), paper.getEndDate(), "paper");

        if (yearResult != null && !yearResult.isEmpty()) {
            conditions.add(yearResult);
        }

        StringBuilder whereCond = conditions.isEmpty() ? new StringBuilder("") : new StringBuilder(" WHERE ");
        for (int i = 0; i < conditions.size(); i++) {
            whereCond.append(conditions.get(i));
            if (i < conditions.size() - 1) {
                whereCond.append(" AND ");
            }
        }

        String groupByClause = "";
        if (paper.getNumOfPapersPublished() > 0) {
            groupByClause = GroupByUtil.groupByQuery("author_paper_mapping", paper.getNumOfPapersPublished(), "author_id", "paper_id");
        }

        return whereCond.toString() + groupByClause;
    }

    /**
     * Search for authors based on the given search criteria
     *
     * @param criteria search criteria
     * @return list of authors matching the criteria
     * @throws SQLException
     */

    @Override
    public List<Author> searchAuthorsByCriteria(SearchCriteria criteria) throws SQLException {

        List<Author> paperAuthors = new ArrayList<>();
        List<Author> confAuthors = new ArrayList<>();
        if (criteria.getPaperInfo() != null) {
            String paperQuery = "SELECT author_paper_mapping.Author_Id FROM author_paper_mapping INNER JOIN paper on author_paper_mapping.Paper_Id = paper.paper_id";
            paperQuery += buildPaperQuery(paperQuery, criteria.getPaperInfo());

            String authorNameCondition = "";
            if (criteria.getAuthorName() != null && !criteria.getAuthorName().isEmpty()) {
                authorNameCondition = buildAuthorNameCondition(criteria.getAuthorName());
            }

            String authorPaperQuery = "SELECT author.* FROM author WHERE Id IN (" + paperQuery + ")" + authorNameCondition;
            paperAuthors = searchDao.searchAuthorsByCriteria(authorPaperQuery);
        }

        if (criteria.getServiceInfo() != null) {

            String editorQuery = "SELECT conference_editor_mapping.editorId FROM conference_editor_mapping INNER JOIN conference on conference_editor_mapping.confId = conference.id";
            editorQuery += buildServiceInfoQuery(editorQuery, criteria.getServiceInfo());

            String positionCondition = "";
            if (criteria.getServiceInfo().getPosition() != null && !criteria.getServiceInfo().getPosition().isEmpty()) {
                positionCondition = " AND " + CriteriaUtil.equalCriteriaQuery("editor", "position", criteria.getServiceInfo().getPosition());
            }

            String authorNameCondition = "";
            if (criteria.getAuthorName() != null && !criteria.getAuthorName().isEmpty()) {
                authorNameCondition = buildAuthorNameCondition(criteria.getAuthorName());
            }

            String authConfQuery = "SELECT author.* from author WHERE Id IN (SELECT editor.Author_Id from editor WHERE editor.id IN (" + editorQuery + ")" + positionCondition + ")" + authorNameCondition;
            confAuthors = searchDao.searchAuthorsByCriteria(authConfQuery);
        }

        List<Author> authors = processLists(paperAuthors, confAuthors, criteria);

        // if only author name is provided
        if (criteria.getPaperInfo() == null && criteria.getServiceInfo() == null
                && criteria.getAuthorName() != null && !criteria.getAuthorName().isEmpty()) {

            String authNameQuery = "SELECT author.* from author WHERE author.Name LIKE '%" + criteria.getAuthorName() + "%'";
            authors = searchDao.searchAuthorsByCriteria(authNameQuery);
        }

        //System.out.println(author_ids.toString());
        System.out.println("DONE!");
        Collections.sort(authors);
        return authors;
    }

    private List<Author> processLists(List<Author> paperAuthors, List<Author> confAuthors, SearchCriteria criteria) {

        Set<Author> authors = new HashSet<Author>();
        if (criteria.getPaperInfo() != null && criteria.getServiceInfo() != null) {
            authors.addAll(paperAuthors);
            if (criteria.isUnion()) {
                authors.addAll(confAuthors);
            } else {
                authors.retainAll(confAuthors);
            }
        } else {
            authors.addAll(paperAuthors);
            authors.addAll(confAuthors);
        }
        return new ArrayList<Author>(authors);
    }

    public String buildServiceInfoQuery(String query, ServiceInfo serviceInfo) {

        List<String> conditions = new ArrayList<String>();

        if (serviceInfo.getConferenceName() != null && !serviceInfo.getConferenceName().isEmpty()) {
            StringBuilder confNameString = new StringBuilder();
            String[] confNames = serviceInfo.getConferenceName().split(",");
            for (int i = 0; i < confNames.length; i++) {
                confNameString.append("'" + confNames[i].trim() + "'");
                if (i != confNames.length - 1) {
                    confNameString.append(",");
                }

            }
            conditions.add(PublicationUtil.conferenceQuery("conference", confNameString.toString(), serviceInfo.isHasServed()));
        }

		/*if(serviceInfo.getPosition() !=null && !serviceInfo.getPosition().isEmpty()){
			conditions.add(CriteriaUtil.equalCriteriaQuery("editor", "position", serviceInfo.getPosition()));
		}*/

        String yearResult = YearUtil.formYearQuery(serviceInfo.getOptions(), serviceInfo.getStartDate(), serviceInfo.getEndDate(), "conference");

        if (yearResult != null && !yearResult.isEmpty()) {
            conditions.add(yearResult);
        }

        StringBuilder whereCond = conditions.isEmpty() ? new StringBuilder("") : new StringBuilder(" WHERE ");
        for (int i = 0; i < conditions.size(); i++) {
            whereCond.append(conditions.get(i));
            if (i < conditions.size() - 1) {
                whereCond.append(" AND ");
            }
        }

        return whereCond.toString();
    }

    private String buildAuthorNameCondition(String authorName) {
        return " AND " + CriteriaUtil.containsCriteriaQuery("author", "Name", authorName);
    }

    @Override
    public List<PaperInfo> searchPapersByKeyword(String keyword) throws SQLException {

        String query = "select * " +
                "from paper p " +
                "where p.title like '%" + keyword + "%';";

        System.out.println(query);

        SearchPaperDao searchPaperDao = new SearchPaperDaoImpl();
        List<PaperInfo> papers = searchPaperDao.searchPapersByKeyword(query);
        return papers;
    }

    @Override
    public List<PaperCitation> getTopCitedPapersForTopic(String top, String title) {

        String home = "src/python";

//        try {
//            home = System.getenv("PY_HOME");
//            System.out.println(home);
//
//            if (home.isEmpty()) {
//                System.out.println("Make sure you have a Env variable PY_HOME pointing to scholar.py directory!");
//            }
//        } catch (Exception e) {
//            System.out.println("Make sure you have a Env variable PY_HOME pointing to scholar.py directory!");
//        }

        //in mac oxs
        String command = "./scholar.py --phrase \"" + title + "\"";
        List<PaperCitation> paperCitations = null;

        Process p;
        try {
            p = Runtime.getRuntime().exec(command, null, new File(home));
            p.waitFor();
            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(p.getInputStream()));

            paperCitations = new ArrayList<>();
            PaperCitation paperCitation = new PaperCitation();

            String line;
            while ((line = reader.readLine()) != null) {

                if (line.length() == 0) {
                    paperCitations.add(paperCitation);
                    paperCitation = new PaperCitation();
                    continue;
                }
                String key = line.substring(0, 14).trim();
                String value = line.substring(15).trim();

                switch (key) {
                    case "Title":
                        paperCitation.setTitle(value);
                        break;
                    case "URL":
                        paperCitation.setURL(value);
                        break;
                    case "Year":
                        paperCitation.setYear(value);
                        break;
                    case "Citations":
                        paperCitation.setCitations(value);
                        break;
                    case "Versions":
                        paperCitation.setVersions(value);
                        break;
                    case "Cluster ID":
                        paperCitation.setClusterId(value);
                        break;
                    case "PDF link":
                        paperCitation.setPdfLink(value);
                        break;
                    case "Citations list":
                        paperCitation.setCitationsList(value);
                        break;
                    case "Versions list":
                        paperCitation.setVersionsList(value);
                        break;
                    case "Excerpt":
                        paperCitation.setExcerpt(value);
                        break;
                    default:
                        break;
                }
            }
            System.out.println();
            reader.close();

            paperCitations.sort(new MyComparator());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return paperCitations;
    }
}

class MyComparator implements Comparator<PaperCitation> {
    @Override
    public int compare(PaperCitation o1, PaperCitation o2) {
        int o1v = Integer.parseInt(o1.getCitations());
        int o2v = Integer.parseInt(o2.getCitations());
        return o1v == o2v ? 0 : o1v > o2v ? -1 : 1;
    }
}
