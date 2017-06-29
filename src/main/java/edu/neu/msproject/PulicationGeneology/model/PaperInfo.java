package edu.neu.msproject.PulicationGeneology.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Created by paulomimahidharia on 6/9/17.
 */
@Getter
@Setter
public class PaperInfo {

    private String paperId;
    private String paperKey;
    private String title;
    private String bookTitle;
    private String year;
    private String conferenceName;
    private String conferenceKey;
    private String conferenceUrl;
    private List<Author> authors;
}
