package edu.neu.msproject.PulicationGeneology.model;

/**
 * Created by paulomimahidharia on 8/20/17.
 */
public class PaperCitation {

    private String title;
    private String URL;
    private String year;
    private String citations;
    private String versions;
    private String clusterId;
    private String pdfLink;
    private String CitationsList;
    private String versionsList;
    private String Excerpt;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getURL() {
        return URL;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getCitations() {
        return citations;
    }

    public void setCitations(String citations) {
        this.citations = citations;
    }

    public String getVersions() {
        return versions;
    }

    public void setVersions(String versions) {
        this.versions = versions;
    }

    public String getClusterId() {
        return clusterId;
    }

    public void setClusterId(String clusterId) {
        this.clusterId = clusterId;
    }

    public String getPdfLink() {
        return pdfLink;
    }

    public void setPdfLink(String pdfLink) {
        this.pdfLink = pdfLink;
    }

    public String getCitationsList() {
        return CitationsList;
    }

    public void setCitationsList(String citationsList) {
        CitationsList = citationsList;
    }

    public String getVersionsList() {
        return versionsList;
    }

    public void setVersionsList(String versionsList) {
        this.versionsList = versionsList;
    }

    public String getExcerpt() {
        return Excerpt;
    }

    public void setExcerpt(String excerpt) {
        Excerpt = excerpt;
    }
}
