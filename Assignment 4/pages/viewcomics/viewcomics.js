function reqComic(elmnt) {
    var userid = elmnt.name;
    var comicid = elmnt.id;
    var d = new Windows.Web.Http.HttpClient();
    var params = "id=" + userid + "&comic=" + comicid;
    var pl = encodeURI(params);
    var con = new Windows.Web.Http.HttpStringContent(pl, Windows.Storage.Streams.UnicodeEncoding.utf8,
                    'application/x-www-form-urlencoded');   // assemble the content
    var uri2 = new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/comic/request");
    d.putAsync(uri2, con).done(function (res) {
        if (res.statusCode == 200) {
            document.getElementById("error").innerHTML = "";
            document.getElementById("main").innerHTML = "<h3>Request Acknowledged</h3>";
            //document.getElementById("ok").onclick = function () {
                //WinJS.Navigation.navigate('/pages/viewcomics/viewcomics.html', { id: userid });
            //}
        }
        else if(res.statusCode == 406){
            document.getElementById("error").innerHTML = res.content + "<br>Please Try Again";
        }
        else {
            document.getElementById("error").textContent = "An Unknown Error Occurred; Please Try Again";
        }
    }
)
};

function renderTable(input, id) {
    var str = input.content.toString();    // stringify the content JSON
    var obj = JSON.parse(str);              // parse it
    // dynamically create the table
    document.getElementById("main").innerHTML = "<table id='table'><tr><th>Title</th><th>Issue</th><th>Available</th><th>Request</th></tr></table>";
    var table = document.getElementById("table");           // get the table to update the elements
    var objsize = Object.keys(obj).length;
    for (var i = 0; i < objsize; i++) {     // loop over each comic in the JSON
        var row = table.insertRow(i + 1);                     // insert a row in the table
        var cell1 = row.insertCell(0).innerHTML = obj[i].title;  // insert 4 cells/ populate them
        var cell2 = row.insertCell(1).innerHTML = obj[i].issue;
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        if (obj[i].available == true) {
            cell3.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&#10004";
        }
        else {
            cell3.innerHTML = "";
        }
        var btn = document.createElement("BUTTON");
        var t = document.createTextNode("Request");
        btn.appendChild(t);
        btn.id = obj[i].id;
        btn.name = id;
        var att = document.createAttribute("onclick");
        att.value = "reqComic(this)";
        btn.setAttributeNode(att);
        cell4.appendChild(btn);
    }
}

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/viewcomics/viewcomics.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var c = new Windows.Web.Http.HttpClient();
            var parameters = "?available=true&id=" + options.id;
            var payload = encodeURI(parameters);
            var uri = new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/comic/view" + payload);
            c.getAsync(uri).done(function (result) {
                // Good Status
                if (result.statusCode == 200) {
                    renderTable(result, options.id);
                }
                else if(result.statusCode == 404){
                    document.getElementById("main").innerHTML = document.getElementById("main").innerHTML = "<table id='table'><tr><th>Title</th><th>Issue</th><th>Available</th><th>Request</th></tr></table>";
                }
                // Bad Status
                else {
                    document.getElementById("error").textContent = "An Unknown Error Occurred; Please Try Again";
                }
            });
        }
    });
})();