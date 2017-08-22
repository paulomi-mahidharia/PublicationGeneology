package edu.neu.msproject.PulicationGeneology.service;

import edu.neu.msproject.PulicationGeneology.dao.SearchConferenceDao;
import edu.neu.msproject.PulicationGeneology.dao.SearchConferenceDaoImpl;
import edu.neu.msproject.PulicationGeneology.model.Conference;

import java.sql.SQLException;
import java.util.List;


public class ConferenceServiceImpl implements ConferenceService {

    SearchConferenceDao searchConfDao = new SearchConferenceDaoImpl();

    /**
     * Retrieves list of conferences from database.
     *
     * @Given:This method does not take anything
     * @return: A List of conferences
     * @exception:SQL Exception
     */

    @Override
    public List<Conference> retrieveAllConferences() throws SQLException {

        String queryString = "SELECT DISTINCT name FROM conference";

        List<Conference> conferences = searchConfDao.retrieveDistinctConf(queryString);

        return conferences;

    }

    @Override
    public List<Conference> getAllPaperConferences() throws SQLException {

        String queryString = "SELECT DISTINCT conference_name FROM paper;";

        List<Conference> conferences = searchConfDao.retrieveDistinctConf(queryString);

        return conferences;
    }
}
