package edu.neu.msproject.PulicationGeneology.dao;

import edu.neu.msproject.PulicationGeneology.model.Author;
import edu.neu.msproject.PulicationGeneology.model.Paper;

import java.sql.SQLException;
import java.util.List;

public interface SearchAuthorDao {
	/**
	 * Search for authors based on the given search criteria
	 * @param queryString
	 * @return list of authors matching the criteria
	 */
	public List<Author> searchAuthorsByCriteria(String queryString) throws SQLException;

}
