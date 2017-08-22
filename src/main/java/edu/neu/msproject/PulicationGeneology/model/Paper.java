package edu.neu.msproject.PulicationGeneology.model;

public class Paper {


    public String keyword;
    private int numOfPapersPublished;
    private boolean isPublished;
    private String conferenceName;
    private boolean contains;
    private String options;
    private int startDate;
    private int endDate;

    public Paper(int numOfPapersPublished, boolean isPublished, String conferenceName, boolean contains, String options,
                 int startDate, int endDate, String keyword) {
        super();
        this.numOfPapersPublished = numOfPapersPublished;
        this.isPublished = isPublished;
        this.conferenceName = conferenceName;
        this.contains = contains;
        this.options = options;
        this.startDate = startDate;
        this.endDate = endDate;
        this.keyword = keyword;
    }


    public Paper() {
        this.conferenceName = "";
        this.numOfPapersPublished = 0;
        this.startDate = 0;
        this.endDate = 0;
        this.options = "";
    }


    public int getNumOfPapersPublished() {
        return numOfPapersPublished;
    }

    public void setNumOfPapersPublished(int numOfPapersPublished) {
        this.numOfPapersPublished = numOfPapersPublished;
    }

    public boolean isContains() {
        return contains;
    }

    public void setContains(boolean contains) {
        this.contains = contains;
    }

    public String getConferenceName() {
        return conferenceName;
    }

    public void setConferenceName(String conferenceName) {
        this.conferenceName = conferenceName;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean isPublished) {
        this.isPublished = isPublished;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public int getStartDate() {
        return startDate;
    }

    public void setStartDate(int startDate) {
        this.startDate = startDate;
    }

    public int getEndDate() {
        return endDate;
    }

    public void setEndDate(int endDate) {
        this.endDate = endDate;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
}
