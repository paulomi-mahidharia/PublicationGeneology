package edu.neu.msproject.PulicationGeneology.service;

import edu.neu.msproject.PulicationGeneology.model.Conference;

import java.sql.SQLException;
import java.util.List;


/**
 * Retrieves list of conferences from database.This method is abstract implementation
 * @Given:This method does not take anything
 * @return: A List of conferences
 *
 */
public interface ConferenceService {

	
	
	public List<Conference> retrieveAllConferences() throws SQLException;
}
