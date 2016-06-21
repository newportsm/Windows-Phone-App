function returnComic(elmnt) {
    var userid = elmnt.name;
    var comicid = elmnt.id;
    var lat = elmnt.value;
    var long = elmnt.alt;
    var d = new Windows.Web.Http.HttpClient();
    var params = "id=" + userid + "&comic=" + comicid + "&available=true";
    var pl = encodeURI(params);
    var con = new Windows.Web.Http.HttpStringContent(pl, Windows.Storage.Streams.UnicodeEncoding.utf8,
                    'application/x-www-form-urlencoded');   // assemble the content
    var uri2 = new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/comic/update");
    d.putAsync(uri2, con).done(function (res) {
        if (res.statusCode == 200) {
            document.getElementById("error").innerHTML = "";
            document.getElementById("main").innerHTML = "<h3>Check-In Acknowledged</h3><br><button id='ok'>OK</button>";
            document.getElementById("ok").onclick = function () {
                WinJS.Navigation.navigate('/pages/login/login.html', { id: userid, lat: lat, long: long });
            }
        }
        else if (res.statusCode == 406) {
            document.getElementById("error").innerHTML = res.content + "<br>Please Try Again";
        }
        else {
            document.getElementById("error").textContent = "An Unknown Error Occurred; Please Try Again";
        }
    }
)
};


function deleteComic(elmnt) {
    var userid = elmnt.name;
    var comicid = elmnt.id;
    var lat = elmnt.value;
    var long = elmnt.alt;
    var d = new Windows.Web.Http.HttpClient();
    var params = "?id=" + userid + "&comic=" + comicid;

    var uri = "http://assignment-3-part-2.appspot.com/comic/delete";
    var uristring = uri + params;
    var encodeduri = encodeURI(uristring);
    //var pl = encodeURI(params);
    var con = new Windows.Web.Http.HttpStringContent(Windows.Storage.Streams.UnicodeEncoding.utf8,
                    'application/x-www-form-urlencoded');   // assemble the content
    var uri2 = new Windows.Foundation.Uri(encodeduri);
    d.deleteAsync(uri2, con).done(function (res) {
        if (res.statusCode == 200) {
            document.getElementById("error").innerHTML = "";
            document.getElementById("main").innerHTML = "<h3>Delete Acknowledged</h3><br><button id='ok'>OK</button>";
            document.getElementById("ok").onclick = function () {
                WinJS.Navigation.navigate('/pages/login/login.html', { id: userid, lat: lat, long: long });
            }
        }
        else if (res.statusCode == 406) {
            document.getElementById("error").innerHTML = res.content + "<br>Please Try Again";
        }
        else {
            document.getElementById("error").textContent = "An Unknown Error Occurred; Please Try Again";
        }
    }
)
};


(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/login/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var city = "Unable to Locate";
            var e = new Windows.Web.Http.HttpClient();
            //var parameterse = "?latlng=39.529633,-119.813803&key=AIzaSyD6BPIw9cyjSXTklfJTaTRZTA2kLL-doJE"
            var parameterse = "?latlng=" + options.lat + "," + options.long + "&key=AIzaSyD6BPIw9cyjSXTklfJTaTRZTA2kLL-doJE";
            var payloade = encodeURI(parameterse);
            var urie = new Windows.Foundation.Uri("https://maps.googleapis.com/maps/api/geocode/json" + payloade);
            e.getAsync(urie).done(function (resulte) {
                // Good Status
                if (resulte.statusCode == 200) {
                    var locationjson = JSON.parse(resulte.content.toString());
                    city = locationjson.results[3].formatted_address;
                }
            });

            // TODO: Initialize the page here.
            var idNum = options.id;
            var c = new Windows.Web.Http.HttpClient();
            var parameters = "?" + "id=" + idNum;
            var payload = encodeURI(parameters);
            var uri = new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/user/view" + payload);
            c.getAsync(uri).done(function (result) {
                // Good Status
                if (result.statusCode == 200) {
                    var str = result.content.toString();    // stringify the content JSON
                    var obj = JSON.parse(str);              // parse it
                    // dynamically create the table
                    document.getElementById("main").innerHTML = "<h5>My ID#</h5><p id='idnum'></p><button id='add'>Add a Comic</button> <button id ='requests'>View My Requests";
                    document.getElementById("main").innerHTML += "</button> <button id='view'>View Comics</button><br><h5>My Comics</h5><table id='table'><tr><th>Title</th><th>Issue</th><th>Available</th><th>Delete</th></tr></table>";
                    document.getElementById("logout").onclick = function () {
                        WinJS.Navigation.navigate('/pages/home/home.html');
                    }
                    document.getElementById("view").onclick = function () {
                        WinJS.Navigation.navigate('/pages/viewcomics/viewcomics.html', { id: options.id });
                    }
                    document.getElementById("requests").onclick = function () {
                        WinJS.Navigation.navigate('/pages/viewrequests/viewrequests.html', { id: options.id, city: city });
                    }
                    document.getElementById("add").onclick = function () {
                        WinJS.Navigation.navigate('/pages/addcomic/addcomic.html', {id: options.id});
                    }
                    document.getElementById("idnum").textContent = options.id;     // display the user id#
                    var table = document.getElementById("table");           // get the table to update the elements
                    for (var i = 0; i < Object.keys(obj).length; i++) {     // loop over each comic in the JSON
                        var row = table.insertRow(i+1);                     // insert a row in the table
                        var cell1 = row.insertCell(0);                      // insert 3 cells
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        cell1.innerHTML = obj[i].title;             // set the values in the cells
                        cell2.innerHTML = obj[i].issue;
                        if (obj[i].available == true) {
                            cell3.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&#10004";
                        }
                        else {
                            var btn = document.createElement("BUTTON");
                            var t = document.createTextNode("Check-In");
                            btn.appendChild(t);
                            btn.id = obj[i].id;
                            btn.name = options.id;
                            btn.value = options.lat;
                            btn.alt = options.long;
                            var att = document.createAttribute("onclick");
                            att.value = "returnComic(this)";
                            btn.setAttributeNode(att);
                            cell3.appendChild(btn);
                        }

                        var dltbtn = document.createElement("BUTTON");
                        var dltbtntext = document.createTextNode("Delete");
                        dltbtn.appendChild(dltbtntext);
                        dltbtn.id = obj[i].id;
                        dltbtn.name = options.id;
                        dltbtn.value = options.lat;
                        dltbtn.alt = options.long;
                        var dltatt = document.createAttribute("onclick");
                        dltatt.value = "deleteComic(this)";
                        dltbtn.setAttributeNode(dltatt);
                        cell4.appendChild(dltbtn);
                    }
                }
                // Bad Status
                else {
                    // No User Found
                    if (result.statusCode == 404) {    // display specific error message
                        var code = "That User Does Not Exist; Please Press Back and Try Again";
                    }
                    // Bad Argument
                    else if (result.statusCode == 406) {    // display specific error message
                        var code = result.content.toString() + "<br>Please Press Back and Try Again";
                    }
                    // Really Bad Unknown Status
                    else {                                  // display generic error message
                        var code = "An Unknown Error Occurred; Please Press Back and Try Again";
                    }
                    document.getElementById("main").innerHTML = "<p>" + code + "</p>";
                }
            });
        }
    });
})();
