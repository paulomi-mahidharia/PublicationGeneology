package edu.neu.msproject.PulicationGeneology.dao;

import edu.neu.msproject.PulicationGeneology.model.Conference;

import java.sql.SQLException;
import java.util.List;

/**
 * The below interface is used to define two methods 
 * 1)Retrieve a list of conference names 
 * 2)Retrieve a list of distinct conference name
 *
 */
public interface SearchConferenceDao {


/**
 * @param A query String to retrieve conferences from database
 * @return A list of conference
 * Retrieve a list of conferences
 */
	
	public List<Conference> retrieveConference(String queryString) throws SQLException;


	/**
	 * @param A query String to retrieve conferences from database
	 * @return A list of conference
	 * Retrieve a list of  distinct conferences
	 */
	
	List<Conference> retrieveDistinctConf(String queryString) throws SQLException;
}
