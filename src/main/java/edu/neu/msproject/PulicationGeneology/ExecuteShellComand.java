package edu.neu.msproject.PulicationGeneology;

import edu.neu.msproject.PulicationGeneology.model.PaperCitation;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Created by paulomimahidharia on 8/20/17.
 */
public class ExecuteShellComand {

    public static void main(String args[]) {

        String home = "";

        try{
            home = System.getenv("PY_HOME");
            System.out.println(home);

            if(home == null || home.isEmpty()) {
                System.out.println("Make sure you have a Env variable SCHOLAR_HOME pointing to scholar.py directory!");
            }
        }catch (Exception e){
            System.out.println("Make sure you have a Env variable SCHOLAR_HOME pointing to scholar.py directory!");
        }

        //in mac oxs
        String command = "./scholar.py --phrase \"distributed cloud computing\"";

        //in windows
        //String command = "ping -n 3 " + domainName;

        //executeCommand(command, home);

        Process p;
        try {
            p = Runtime.getRuntime().exec(command, null, new File(home));
            p.waitFor();
            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(p.getInputStream()));

            List<PaperCitation> paperCitations = new ArrayList<>();
            PaperCitation paperCitation = new PaperCitation();

            String line;
            while ((line = reader.readLine())!= null) {

                if(line.length() == 0) {
                    paperCitations.add(paperCitation);
                    paperCitation = new PaperCitation();
                    continue;
                }
                String key = line.substring(0, 14).trim();
                String value = line.substring(15).trim();

                switch (key) {
                    case "Title":
                        paperCitation.setTitle(value);
                        break;
                    case "URL":
                        paperCitation.setURL(value);
                        break;
                    case "Year":
                        paperCitation.setYear(value);
                        break;
                    case "Citations":
                        paperCitation.setCitations(value);
                        break;
                    case "Versions":
                        paperCitation.setVersions(value);
                        break;
                    case "Cluster ID":
                        paperCitation.setClusterId(value);
                        break;
                    case "PDF link":
                        paperCitation.setPdfLink(value);
                        break;
                    case "Citations list":
                        paperCitation.setCitationsList(value);
                        break;
                    case "Versions list":
                        paperCitation.setVersionsList(value);
                        break;
                    case "Excerpt":
                        paperCitation.setExcerpt(value);
                        break;
                    default:
                        break;
                }
            }
            reader.close();

            paperCitations.sort(new MyComparator());
            System.out.println();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class MyComparator implements Comparator<PaperCitation> {
    @Override
    public int compare(PaperCitation o1, PaperCitation o2) {
        int o1v = Integer.parseInt(o1.getCitations());
        int o2v = Integer.parseInt(o2.getCitations());
        return o1v == o2v? 0: o1v>o2v? -1: 1;
    }
}
