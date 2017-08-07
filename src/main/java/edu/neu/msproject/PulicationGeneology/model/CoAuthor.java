package edu.neu.msproject.PulicationGeneology.model;

import java.util.List;

/**
 * Created by paulomimahidharia on 8/6/17.
 */
public class CoAuthor {

    private int paperId;
    private String confName;
    private String title;
    private int year;
    private List<Author> authors;

    public int getPaperId() {
        return paperId;
    }

    public void setPaperId(int paperId) {
        this.paperId = paperId;
    }

    public String getConfName() {
        return confName;
    }

    public void setConfName(String confName) {
        this.confName = confName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public List<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(List<Author> authors) {
        this.authors = authors;
    }
}
