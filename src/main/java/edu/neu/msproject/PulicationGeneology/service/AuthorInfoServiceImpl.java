package edu.neu.msproject.PulicationGeneology.service;

import edu.neu.msproject.PulicationGeneology.dao.*;
import edu.neu.msproject.PulicationGeneology.model.Author;
import edu.neu.msproject.PulicationGeneology.model.AuthorPaper;
import edu.neu.msproject.PulicationGeneology.model.CoAuthor;
import edu.neu.msproject.PulicationGeneology.model.Conference;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class AuthorInfoServiceImpl implements AuthorInfoService {

	private SearchPaperDao searchPaperDao = new SearchPaperDaoImpl();
	private SearchAuthorDao searchAuthorDao = new SearchAuthorDaoImpl();
	private SearchConferenceDao searchConfDao = new SearchConferenceDaoImpl();
	
	/**
	 * Retrieves an author's profile for the given authorId
	 * @param authorId Id of an author
	 * @return author's profile information 
	 */
	
	@Override
	public Author getAuthorProfile(int authorId) {
		List<Author> authors = new ArrayList<Author>();
		String queryString = "SELECT * FROM author WHERE author.id = "+authorId;
		try {
			authors = searchAuthorDao.searchAuthorsByCriteria(queryString);
		} catch (SQLException e) {
			return null;
		}
		
		return authors.isEmpty()? null :authors.get(0);
	}

	/**
	 * Retrieves a list of published papers by author for the given authorId
	 * @param authorId Id of an author
	 * @return list of published papers
	 */
	
	@Override
	public List<AuthorPaper> getAuthorPapers(int authorId) throws SQLException {
		
		List<AuthorPaper> authorPapers = new ArrayList<AuthorPaper>();
		
		String queryString = "SELECT * FROM paper WHERE paper.paper_id IN (SELECT paper_Id FROM author_paper_mapping WHERE author_paper_mapping.Author_id = "+authorId+")";
		System.out.println(queryString);
		authorPapers = searchPaperDao.retrievePapers(queryString);
		
		return authorPapers;
	}

	/**
	 * Retrieves a list of conferences attended by author for the given authorId
	 * @param authorId Id of an author
	 * @return list of conference papers
	 */
	
	@Override
	public List<Conference> getAuthorConferenceServed(int authorId) throws SQLException {
		
		List<Conference> authorConfServed = new ArrayList<Conference>();
		
		String queryString = "SELECT * FROM conference WHERE ID IN (SELECT confid FROM conference_editor_mapping where editorid IN (SELECT ID FROM editor where Author_Id = "+authorId +"))";

		
		authorConfServed = searchConfDao.retrieveConference(queryString);
		return authorConfServed;
	}

	@Override
	public List<CoAuthor> getCoAuthors(int authorId, int paperId, String year) throws SQLException {

		List<CoAuthor> authorPapers = new ArrayList<>();

//		String queryString = "select p.* \n" +
//				"from paper p, author a, author_paper_mapping ap \n" +
//				"where ap.Author_Id = a.Id \n" +
//				"and ap.Paper_Id = p.paper_id \n" +
//				"and p.year = '"+year+"' \n" +
//				"and a.Id = "+authorId+" \n" +
//				"and p.paper_id !="+paperId;

		String queryString = "select a.*, p.paper_id, p.title, p.conference_name, p.year \n" +
				"from paper p, author a, author_paper_mapping ap \n" +
				"where ap.Author_Id = a.Id \n" +
				"and ap.Paper_Id = p.paper_id \n" +
				"and a.Id != "+authorId+" \n" +
				"and p.paper_id in (select p.paper_id \n" +
									"from paper p, author a, author_paper_mapping ap \n" +
									"where ap.Author_Id = a.Id \n" +
									"and ap.Paper_Id = p.paper_id \n" +
									"and p.year = '"+year+"' \n" +
									"and a.Id = "+authorId+" \n" +
									"and p.paper_id != "+paperId+")";

		System.out.println(queryString);

		authorPapers = searchPaperDao.getCoAuthors(queryString);
		return authorPapers;
	}

	@Override
	public List<Author> getTopAuthorsForConference(String conference, String top) throws SQLException {

		List<Author> authors = new ArrayList<>();

		String query = "SELECT distinct a.*, count(distinct p.paper_id)\n " +
				"FROM author a, paper p, author_paper_mapping ap\n " +
				"WHERE ap.Author_Id = a.Id \n " +
				"AND ap.Paper_Id = p.paper_id \n " +
				"AND p.conference_name = '"+ conference +"'\n " +
				"GROUP BY a.Name\n " +
				"ORDER BY count(distinct p.paper_id) desc \n" +
				"LIMIT " + top;

		authors = searchPaperDao.getTopAuthorsForConference(query);
		return authors;
	}

}
