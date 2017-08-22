package edu.neu.msproject.PulicationGeneology.model;

public class SearchCriteria {
    private Paper paperInfo;
    private ServiceInfo serviceInfo;
    private boolean union;
    private String authorName;

    public SearchCriteria(String authorName) {
        this.authorName = authorName;
    }

    public SearchCriteria(Paper paperInfo) {
        this.paperInfo = paperInfo;
    }

    public SearchCriteria(ServiceInfo serviceInfo) {
        this.serviceInfo = serviceInfo;
    }

    public SearchCriteria(Paper paperInfo, ServiceInfo serviceInfo) {
        this.paperInfo = paperInfo;
        this.serviceInfo = serviceInfo;
    }

    public SearchCriteria(Paper paperInfo, ServiceInfo serviceInfo, boolean union) {
        this.paperInfo = paperInfo;
        this.serviceInfo = serviceInfo;
        this.union = union;
    }

    public SearchCriteria(Paper paperInfo, ServiceInfo serviceInfo, boolean union, String authorName) {
        this.paperInfo = paperInfo;
        this.serviceInfo = serviceInfo;
        this.union = union;
        this.setAuthorName(authorName);
    }

    public SearchCriteria() {
        // TODO Auto-generated constructor stub
    }

    public Paper getPaperInfo() {
        return paperInfo;
    }

    public void setPaperInfo(Paper paperInfo) {
        this.paperInfo = paperInfo;
    }

    public ServiceInfo getServiceInfo() {
        return serviceInfo;
    }

    public void setServiceInfo(ServiceInfo serviceInfo) {
        this.serviceInfo = serviceInfo;
    }

    public boolean isUnion() {
        return union;
    }

    public void setUnion(boolean union) {
        this.union = union;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
}
