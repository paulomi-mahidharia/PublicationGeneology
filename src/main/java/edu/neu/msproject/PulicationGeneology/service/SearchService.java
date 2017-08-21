package edu.neu.msproject.PulicationGeneology.service;

import edu.neu.msproject.PulicationGeneology.model.*;

import java.sql.SQLException;
import java.util.List;


/**
 * 
 * @author paulomimahidharia
 *
 */
public interface SearchService {
	
	/**
	 * Search for authors based on the given search criteria
	 * @param criteria search criteria
	 * @return list of authors matching the criteria
	 * @throws SQLException 
	 */
	List<Author> searchAuthorsByCriteria(SearchCriteria criteria) throws SQLException;

	List<PaperInfo> searchPapersByKeyword(String keyword) throws SQLException;

    List<PaperCitation> getTopCitedPapersForTopic(String top, String title);
}
