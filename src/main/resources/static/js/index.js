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

        var table = document.getElementById("author-table");

        for(var i=0; i < data.length; i++) {

            var row = table.insertRow(i+1);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = data[i].name;
        }
        document.getElementById("author-table").style.display = "table";

    } else {
        $('#status_not_found').show();
    }
}

function successfulPaperSearchHandler(data, status) {

    if (data.length > 0) {

        console.log(data);
        document.getElementById("author-table").style.display = "none";

        console.log("It hot fixes again");

        var table = document.getElementById("paper-table");

        for(var i=0; i < data.length; i++) {

            var row = table.insertRow(i+1);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = data[i].title;
        }
        document.getElementById("paper-table").style.display = "table";

    } else {
        $('#status_not_found').show();
    }
}

$("#author-table").click(function() {

    console.log("CLICKED");
    var tableData = $(this).children("td").map(function() {
        return $(this).text();
    }).get();

    console.log(tableData);
});