function searchPublication() {

    var author;
    var paper;

    // Search by author name
    if(document.getElementById("author-radio").checked == true){
        author = document.getElementById("author").value;
        if(author == ""){
            alert("Enter a valid Author name");
        }else{
            $.ajax({
                type: 'POST',
                url: './../search/author/',
                data: {
                    authorName: author
                },
                success: successfulAuthorSearchHandler
            });
        }
    }

    // Search by paper title/keyword
    else if(document.getElementById("paper-radio").checked == true){
        console.log("Paper selected as option");

        paper = document.getElementById("paper").value;
        if(paper == ""){
            alert("Enter a valid Paper name");
        }else{
            $.ajax({
                type: 'POST',
                url: './../search/paper/',
                data: {
                    keyword: paper.trim()
                },
                success: successfulPaperSearchHandler
            });
        }
    }
}

function successfulAuthorSearchHandler(data, status) {
    if (data.length > 0) {

        console.log(data);
        console.log(data.length);
        document.getElementById("paper-table").style.display = "none";

        console.log(document.getElementById("author-table").rows.length);

        $('#author-table').find('tr:gt(0)').remove();

        var tr;
        for (var i = 0; i < data.length; i++) {
            console.log("displaying : "+ data[i].name);
            tr+="<tr>";
            tr+="<td>" + data[i].name + "</td>";
            tr+="<td>" + data[i].affiliation + "</td>";
            tr+="<td>" + data[i].url + "</td>";
            tr+="</tr>";
            $('#author-table').append(tr);
        }
        document.getElementById("author-table").style.display = "table";

        //lTable.style.display = "table";

    } else {
        $('#status_not_found').show();
    }
}

function successfulPaperSearchHandler(data, status) {

    if (data.length > 0) {

        console.log(data);
        document.getElementById("author-table").style.display = "none";

        while(document.getElementById("paper-table").rows.length > 0) {
            document.getElementById("paper-table").deleteRow(0);
        }

        document.getElementById("paper-table").style.display = "table";
    } else {
        $('#status_not_found').show();
    }
}