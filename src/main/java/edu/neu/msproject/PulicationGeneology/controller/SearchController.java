package edu.neu.msproject.PulicationGeneology.controller;

import edu.neu.msproject.PulicationGeneology.model.*;
import edu.neu.msproject.PulicationGeneology.service.AuthorInfoService;
import edu.neu.msproject.PulicationGeneology.service.AuthorInfoServiceImpl;
import edu.neu.msproject.PulicationGeneology.service.SearchService;
import edu.neu.msproject.PulicationGeneology.service.SearchServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

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

}
