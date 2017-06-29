package edu.neu.msproject.PulicationGeneology.dao;

import edu.neu.msproject.PulicationGeneology.model.AuthorPaper;
import edu.neu.msproject.PulicationGeneology.model.PaperInfo;

import java.sql.SQLException;
import java.util.List;

/**
 * @return A list of AuthorPaper Mapping
 * Retrieve a list of  Author Paper mappings from database.This is a abstract implementation of the methods
 */
public interface SearchPaperDao {

	public List<AuthorPaper> retrievePapers(String queryString) throws SQLException;

	public List<PaperInfo> searchPapersByKeyword(String queryString) throws SQLException;
}
