package edu.neu.msproject.PulicationGeneology.dao;

import edu.neu.msproject.PulicationGeneology.database.DatabaseConnection;
import edu.neu.msproject.PulicationGeneology.model.Conference;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * The below class is used to define two methods
 * 1)Retrieve a list of conference names
 * 2)Retrieve a list of distinct conference name
 */

public class SearchConferenceDaoImpl implements SearchConferenceDao {

    private Connection conn = DatabaseConnection.getConn();

    /**
     * @param queryString A query String to retrieve conferences from database
     * @return A list of conference
     * Retrieve a list of conferences
     */


    @Override
    public List<Conference> retrieveConference(String queryString) throws SQLException {
        System.out.println(queryString);
        PreparedStatement stmt = conn.prepareStatement(queryString);
        ResultSet rs = stmt.executeQuery();
        stmt.setQueryTimeout(300);

        List<Conference> confs = new ArrayList<Conference>();
        while (rs.next()) {
            Conference c = new Conference();
            c.setConferenceId(Integer.parseInt(rs.getString(1)));
            c.setName(rs.getString(2));
            c.setTitle(rs.getString(3));
            c.setIsbn(rs.getString(4));
            c.setYear(Integer.parseInt(rs.getString(5)));
            confs.add(c);
        }
        return confs;
    }

    /**
     * @param queryString A query String to retrieve conferences from database
     * @return A list of conference
     * Retrieve a list of  distinct conferences
     */

    @Override
    public List<Conference> retrieveDistinctConf(String queryString) throws SQLException {
        System.out.println(queryString);
        PreparedStatement stmt = conn.prepareStatement(queryString);
        ResultSet rs = stmt.executeQuery();
        stmt.setQueryTimeout(300);

        List<Conference> confs = new ArrayList<Conference>();
        while (rs.next()) {
            Conference c = new Conference();
            c.setName(rs.getString(1));
            confs.add(c);
        }
        return confs;
    }

}
