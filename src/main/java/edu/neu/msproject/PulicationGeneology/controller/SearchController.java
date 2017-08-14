package edu.neu.msproject.PulicationGeneology.controller;

import edu.neu.msproject.PulicationGeneology.model.*;
import edu.neu.msproject.PulicationGeneology.service.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by paulomimahidharia on 6/9/17.
 */
@RestController
public class SearchController {

    @RequestMapping(value = "/search/author/", method = RequestMethod.POST)
    public List<Author> searchAuthorByName(@RequestParam(value = "authorName", required = true) final String authorName) throws SQLException, IOException {

        System.out.println(authorName);

        SearchCriteria criteria = new SearchCriteria();
        criteria.setAuthorName(authorName);

        SearchService searchService = new SearchServiceImpl();
        List<Author> authors = searchService.searchAuthorsByCriteria(criteria);
        System.out.println("AUT : "+authors.size());
        return authors;
    }

    @RequestMapping(value = "/search/paper/", method = RequestMethod.POST)
    public List<PaperInfo> searchPaperByKeyword(@RequestParam(value = "keyword", required = true) final String keyword) throws SQLException, IOException {

        System.out.println("CON : "+keyword);

        Paper paperInfo = new Paper();
        paperInfo.setKeyword(keyword);

        SearchCriteria criteria = new SearchCriteria();
        criteria.setPaperInfo(paperInfo);

        SearchService searchService = new SearchServiceImpl();
        List<PaperInfo> papers = searchService.searchPapersByKeyword(keyword);
        //List<Author> authors = searchService.searchAuthorsByCriteria(criteria);
        //System.out.println("AUT : "+authors.size());
        return papers;
    }

    @RequestMapping(value = "/search/paper/authors", method = RequestMethod.POST)
    public List<Author> searchAuthorsForPaper(@RequestParam(value = "title", required = true) final String keyword) throws SQLException, IOException {

        System.out.println("CON : "+keyword);

        Paper paperInfo = new Paper();
        paperInfo.setKeyword(keyword);

        SearchCriteria criteria = new SearchCriteria();
        criteria.setPaperInfo(paperInfo);

        SearchService searchService = new SearchServiceImpl();
        List<Author> authors = searchService.searchAuthorsByCriteria(criteria);
        //List<Author> authors = searchService.searchAuthorsByCriteria(criteria);
        //System.out.println("AUT : "+authors.size());
        return authors;
    }

    @RequestMapping(value = "/search/author/{authorId}/papers", method = RequestMethod.GET)
    public List<AuthorPaper> searchPapersForAuthor(@PathVariable(value = "authorId", required = true) final String authorId) throws SQLException, IOException {

        System.out.println("Finding authors");
        AuthorInfoService authorInfoService = new AuthorInfoServiceImpl();
        return authorInfoService.getAuthorPapers(Integer.parseInt(authorId));
    }

    @RequestMapping(value = "/search/author/{authorId}/conferences", method = RequestMethod.GET)
    public List<Conference> getAuthorConferenceServed(@PathVariable(value = "authorId", required = true) final String authorId) throws SQLException, IOException {

        System.out.println("Finding authors");
        AuthorInfoService authorInfoService = new AuthorInfoServiceImpl();
        return authorInfoService.getAuthorConferenceServed(Integer.parseInt(authorId));
    }

    @RequestMapping(value = "/search/author/{authorId}/papers/year/{year}", method = RequestMethod.POST)
    public List<CoAuthor> getCoAuthors(@PathVariable(value = "authorId", required = true) final String authorId,
                                                         @RequestParam(value = "excludePaper", required = true) final String paperId,
                                                         @PathVariable(value = "year", required = true) final String year) throws SQLException, IOException {

        System.out.println("Finding papers for author "+authorId+" in year "+year);
        AuthorInfoService authorInfoService = new AuthorInfoServiceImpl();
        return authorInfoService.getCoAuthors(Integer.parseInt(authorId), Integer.parseInt(paperId), year);
    }

    @RequestMapping(value = "/search/conference/{conference}/authors/top/{top}", method = RequestMethod.GET)
    public List<Author> getTopAuthorsForConference(@PathVariable(value = "conference", required = true) final String conference,
                                                   @PathVariable(value = "top", required = true) final String top) throws SQLException {

        AuthorInfoService authorInfoService = new AuthorInfoServiceImpl();
        return authorInfoService.getTopAuthorsForConference(conference, top);

    }

    @RequestMapping(value = "/search/conferences", method = RequestMethod.GET)
    public Set<Conference> getTopAuthorsForConference() throws SQLException {

        List<Conference> conferences = new ArrayList<>();
        ConferenceService conferenceService = new ConferenceServiceImpl();
        conferences = conferenceService.retrieveAllConferences();

        conferences.addAll(conferenceService.getAllPaperConferences());

        return (Set) new HashSet(conferences);
    }
}
