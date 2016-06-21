function isInteger(x) {
    return x % 1 === 0;
}

function errorMessage() {
    document.getElementById("error").textContent = "That Issue # is Invalid; Please Try Again";
}

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/addcomic/addcomic.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // on clicking the 'submit' button
            document.getElementById("submit").onclick = function () {
                var title = document.getElementById("title").value;
                var issue = document.getElementById("issue").value;
                if (issue && title) {    // input present
                    if (isNaN(issue)) {   // not a number
                        errorMessage();
                    }
                    else if (!isInteger(issue)) {    // is a number, but not an integer
                        errorMessage();
                    }
                    else {          // is an integer, i.e. valid issue#
                        var userid = options.id;
                        var c = new Windows.Web.Http.HttpClient();  // httpclient object instantiated
                        var uri = "title=" + title + "&" + "issue=" + issue + "&" + "id=" + userid;  // form the parameter string
                        var payload = encodeURI(uri);                           // encode it for URI
                        var content = new Windows.Web.Http.HttpStringContent(payload, Windows.Storage.Streams.UnicodeEncoding.utf8,
                            'application/x-www-form-urlencoded');   // assemble the content
                        c.postAsync(new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/comic/add"), content).done(function (result) {     // POST the request
                            // Good Status
                            if (result.statusCode == 200) {
                                document.getElementById("error").innerHTML = "";
                                document.getElementById("main").innerHTML = "<h3>Comic Added Successfully</h3>";
                            }
                                // Bad Status
                            else {
                                var message;
                                if (result.statusCode == 406) {    // display specific error message
                                    message = result.content.toString() + "<br>Please Try Again";
                                }
                                    // Really Bad Status
                                else {                                  // display generic error message
                                    message = "An Unknown Error Occurred;<br>Please Try Again"
                                }
                                document.getElementById("error").innerHTML = "<h1>" + message + "</h1";
                            }
                        });
                    }
                }
                else {   // input absent
                    document.getElementById("error").innerHTML = "Both Fields Are Required; Please Try Again";
                }
            }
        }
    });
})();