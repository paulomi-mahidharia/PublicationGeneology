package edu.neu.msproject.PulicationGeneology.dao;

import edu.neu.msproject.PulicationGeneology.database.DatabaseConnection;
import edu.neu.msproject.PulicationGeneology.model.Author;
import edu.neu.msproject.PulicationGeneology.model.AuthorPaper;
import edu.neu.msproject.PulicationGeneology.model.CoAuthor;
import edu.neu.msproject.PulicationGeneology.model.PaperInfo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class is use to implement SearchPaperDao to retrieve List of Author Paper mapping objects 
 *
 */
public class SearchPaperDaoImpl implements SearchPaperDao {

	/**
	 * @param A query String to retrieve a list of AuthorPaper from database
	 * @return A list of AuthorPaper Mapping
	 * Retrieve a list of  Author Paper mappings from database.
	 */

	private Connection conn = DatabaseConnection.getConn();
	
	@Override
	public List<AuthorPaper> retrievePapers(String queryString) throws SQLException {
		
		PreparedStatement stmt = conn.prepareStatement(queryString);
		ResultSet rs = stmt.executeQuery();
		
		List<AuthorPaper> papers = new ArrayList<AuthorPaper>();
		while(rs.next()){
			AuthorPaper p = new AuthorPaper();
			p.setPaperId(Integer.parseInt(rs.getString(1)));
			p.setPaperTitle(rs.getString(3));
			p.setYear(Integer.parseInt(rs.getString(5)));
			p.setConfName(rs.getString(8));
			p.setUrl(rs.getString(7));
			
			papers.add(p);
		}
		return papers;
	}

	@Override
	public List<PaperInfo> searchPapersByKeyword(String queryString) throws SQLException {

		PreparedStatement stmt = conn.prepareStatement(queryString);
		ResultSet rs = stmt.executeQuery();

		List<PaperInfo> papers = new ArrayList<PaperInfo>();
		while(rs.next()){
			PaperInfo p = new PaperInfo();
			p.setPaperId(rs.getString("paper_id"));
			p.setPaperKey(rs.getString("paper_key"));
			p.setTitle(rs.getString("title"));
			p.setBookTitle(rs.getString("book_title"));
			p.setYear(rs.getString("year"));
			p.setConferenceKey(rs.getString("conference"));
			p.setConferenceName(rs.getString("conference_name"));
			p.setConferenceUrl(rs.getString("url"));

			papers.add(p);
		}
		return papers;
	}

	@Override
	public List<CoAuthor> getCoAuthors(String queryString) throws SQLException {

		PreparedStatement stmt = conn.prepareStatement(queryString);
		ResultSet rs = stmt.executeQuery();

		Map<Integer, List<Author>> paperAuthors = new HashMap<>();
		Map<Integer, AuthorPaper> paperInfo = new HashMap<>();

		List<CoAuthor> coAuthors = new ArrayList<>();

		while(rs.next()){

			int paperId = Integer.parseInt(rs.getString("paper_id"));

			Author author = new Author();
			author.setAuthorId(Integer.parseInt(rs.getString("Id")));
			author.setName(rs.getString("Name"));
			author.setAffiliation(rs.getString("affiliation"));
			author.setUrl(rs.getString("url"));

			List<Author> authors;
			if(paperAuthors.containsKey(paperId)) {
				authors = paperAuthors.get(paperId);
			} else{
				authors = new ArrayList<>();
			}
			authors.add(author);
			paperAuthors.put(paperId, authors);

			if(!paperInfo.containsKey(paperId)) {
				AuthorPaper authorPaper = new AuthorPaper();
				authorPaper.setPaperId(paperId);
				authorPaper.setPaperTitle(rs.getString("title"));
				authorPaper.setConfName(rs.getString("conference_name"));
				authorPaper.setYear(Integer.parseInt(rs.getString("year")));
				paperInfo.put(paperId, authorPaper);
			}
		}

		CoAuthor coAuthor;
		for(Integer paper: paperInfo.keySet()){

			AuthorPaper authorPaper = paperInfo.get(paper);
			List<Author> authors = paperAuthors.get(paper);

			coAuthor = new CoAuthor();
			coAuthor.setPaperId(authorPaper.getPaperId());
			coAuthor.setTitle(authorPaper.getPaperTitle());
			coAuthor.setYear(authorPaper.getYear());
			coAuthor.setConfName(authorPaper.getConfName());
			coAuthor.setAuthors(authors);

			coAuthors.add(coAuthor);
		}
		return coAuthors;
	}

	@Override
	public List<Author> getTopAuthorsForConference(String query) throws SQLException {

		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();

		List<Author> authors = new ArrayList<>();

		while(rs.next()){

			Author author = new Author();
			System.out.println(rs.getInt(1));
			author.setAuthorId(rs.getInt(1));
			author.setName(rs.getString(2));
			author.setAffiliation(rs.getString(3));
			author.setUrl(rs.getString(4));
			author.setPaperCount(rs.getInt(5));

			authors.add(author);
		}
		return authors;
	}

}
