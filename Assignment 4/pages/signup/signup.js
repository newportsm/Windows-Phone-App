(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/signup/signup.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // on clicking the 'submit' button
            document.getElementById("submit").onclick = function () {
                // name and address variables come from the form
                var name = document.getElementById("name").value;
                var address = document.getElementById("address").value;
                var c = new Windows.Web.Http.HttpClient();  // httpclient object instantiated
                var uri = "name=" + name + "&" + "address=" + address;  // form the parameter string
                var payload = encodeURI(uri);                           // encode it for URI
                var content = new Windows.Web.Http.HttpStringContent(payload, Windows.Storage.Streams.UnicodeEncoding.utf8,
                    'application/x-www-form-urlencoded');   // assemble the content
                c.postAsync(new Windows.Foundation.Uri("http://assignment-3-part-2.appspot.com/user/add"), content).done(function (result) {     // POST the request
                    // Good Status
                    if (result.statusCode == 200) {         // pass id # and navigate to login page
                        var id = result.content.toString();
                        document.getElementById("error").innerHTML = "Redirecting to Login Page...";
                        window.setTimeout(function () { WinJS.Navigation.navigate('/pages/login/login.html', { id: id, lat: options.lat, long: options.long }); }, 500);
                    }
                    // Bad Status
                    else if (result.statusCode == 406) {    // display specific error message
                        var code = result.content.toString() + "<br>Please Try Again";
                        document.getElementById("error").innerHTML = code;
                    }
                    // Really Bad Status
                    else {                                  // display generic error message
                        document.getElementById("error").innerHTML = "An Unknown Error Occurred; Please Try Again"
                    }
                });
            }
        }
    });
})();
