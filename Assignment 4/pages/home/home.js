function isInteger(x) {
    return x % 1 === 0;
}

function getLoc(loc) {
    if (loc == null) {
        loc = new Windows.Devices.Geolocation.Geolocator();
    }
    if (loc != null) {
        loc.getGeopositionAsync().then(getPositionHandler, errorHandler);
    }
};

function getPositionHandler(pos) {
    document.getElementById("lat").valueOf = pos.coordinate.point.position.latitude;
    //lat = pos.coordinate.point.position.latitude;
    document.getElementById("long").valueOf = pos.coordinate.point.position.longitude;
    //long = pos.coordinate.point.position.longitude;
};

function errorHandler(e) {
    document.getElementById('errormsg').innerHTML = e.message;
    // Display an appropriate error message based on the location status.
    document.getElementById('geolocatorStatus').innerHTML =
        getStatusString(loc.locationStatus);
}

function errorMessage() {
    document.getElementById("error").textContent = "Invalid ID or Password, please try again!";
}
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var loc = null;
            var lat = null;
            var long = null;
            var idNum = 1;
            getLoc();

            // navigate to signup page on click
            document.getElementById("signup").onclick = function () {
                lat = document.getElementById("lat").valueOf;
                long = document.getElementById("long").valueOf;
                WinJS.Navigation.navigate('/pages/signup/signup.html', { lat: lat, long: long });
                //window.setTimeout(function () { WinJS.Navigation.navigate('/pages/signup/signup.html', { id: idNum, lat: lat, long: long }); }, 500);
            }
            // login button
            document.getElementById("login").onclick = function () {
                idNum = document.getElementById("id").value;
                if (idNum) {    // input present
                    if(isNaN(idNum)){   // not a number
                        errorMessage();
                    }
                    else if (!isInteger(idNum)) {    // is a number, but not an integer
                        errorMessage();
                    }
                    else {          // is an integer, i.e. valid id#
                        lat = document.getElementById("lat").valueOf;
                        long = document.getElementById("long").valueOf;
                        window.setTimeout(function () { WinJS.Navigation.navigate('/pages/login/login.html', { id: idNum, lat: lat, long: long }); }, 500);
                    }
                }
                else {   // input absent
                    errorMessage();
                }
            }
        }
    });
})();
