function shipComic(elmnt) {
    var userid = elmnt.name;
    var comicid = elmnt.id;
    var d = new Windows.Web.Http.HttpClient();
    var params = "id=" + userid + "&comic=" + comicid;
    var pl = encodeURI(params);
    var con = new Windows.Web.Http.HttpStringContent(pl, Windows.Storage.Streams.UnicodeEncoding.utf8,
                    'application/x-www-form-urlencoded');   // assemble the content
    var uri2 = new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/user/acknowledge");
    d.putAsync(uri2, con).done(function (res) {
        if (res.statusCode == 200) {
            document.getElementById("error").innerHTML = "";
            document.getElementById("main").innerHTML = "<h3>Request Acknowledged; Please Mail ASAP</h3>";
        }
        else {
            document.getElementById("error").textContent = "An Unknown Error Occurred";
        }
    }
)};


(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/viewrequests/viewrequests.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ready: function (element, options) {

            // TODO: Initialize the page here.
            var c = new Windows.Web.Http.HttpClient();
            var parameters = "id=" + options.id;
            var payload = encodeURI(parameters);
            var content = new Windows.Web.Http.HttpStringContent(payload, Windows.Storage.Streams.UnicodeEncoding.utf8,
                    'application/x-www-form-urlencoded');   // assemble the content
            var uri = new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/user/request");
            c.putAsync(uri, content).done(function (result) {
                // Good Status
                if (result.statusCode == 200) {

                    var str = result.content.toString();    // stringify the content JSON
                    var obj = JSON.parse(str);              // parse it

                    // dynamically create the table
                    document.getElementById("main").innerHTML = "<p>Estimate Shipping From: <button>" + options.city + "</button></p><br>";
                    document.getElementById("main").innerHTML += "<table id='table'><tr><th>Title</th><th>Issue</th><th>Req. Name</th><th>Req. Address</th><th>Ship</th></tr></table>";
                    var table = document.getElementById("table");           // get the table to update the elements
                    var buttonid;
                    var buttonname = 0;
                    for (var i = 0; i < Object.keys(obj).length; i++) {     // loop over each request in the JSON
                        var row = table.insertRow(i + 1);                     // insert a row in the table
                        var cell1 = row.insertCell(0).innerHTML = obj[i].title;                      // insert 5 cells/ set values
                        var cell2 = row.insertCell(1).innerHTML = obj[i].issue;
                        var cell3 = row.insertCell(2).innerHTML = obj[i].requesting_name;
                        var cell4 = row.insertCell(3).innerHTML = obj[i].requesting_address;
                        var cell5 = row.insertCell(4);
                        var btn = document.createElement("BUTTON");
                        var t = document.createTextNode("Ship");
                        btn.appendChild(t);
                        btn.id = obj[i].id;
                        btn.name = options.id;
                        var att = document.createAttribute("onclick");
                        att.value = "shipComic(this)";
                        btn.setAttributeNode(att);
                        cell5.appendChild(btn);
                    }
                }
                // Bad Status (shouldn't be able to happen for this one)
                else {
                    document.getElementById("main").innerHTML = "<h3>Error; User Not Found</h3>";
                }
            });
        }
    });
})();