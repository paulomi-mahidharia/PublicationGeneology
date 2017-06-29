package edu.neu.msproject.PulicationGeneology.dao;

import edu.neu.msproject.PulicationGeneology.database.DatabaseConnection;
import edu.neu.msproject.PulicationGeneology.model.Author;
import edu.neu.msproject.PulicationGeneology.model.AuthorPaper;
import edu.neu.msproject.PulicationGeneology.model.PaperInfo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

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

			List<Author> authors = new ArrayList<>();
			//Get Authors
			/*String authorQuery = "select a.* \n" +
					"from paper p, author a, author_paper_mapping ap \n" +
					"where p.paper_id = ap.Paper_Id \n" +
					"and a.Id = ap.Author_Id \n" +
					"and p.paper_id = '"+p.getPaperId()+"';";

			PreparedStatement stmt1 = conn.prepareStatement(queryString);
			ResultSet rs1 = stmt1.executeQuery();

			while(rs1.next()){
				Author author = new Author();
				author.setAuthorId(Integer.parseInt(rs.getString(1)));
				author.setName(rs.getString(2));
				author.setAffiliation(rs.getString(3));
				author.setUrl(rs.getString(4));

				authors.add(author);
			}

			p.setAuthors(authors);*/

			papers.add(p);
		}
		return papers;
	}

}
