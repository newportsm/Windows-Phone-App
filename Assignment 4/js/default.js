// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=329110
(function () {
    "use strict";

    function getLoc() {
        if (loc == null) {
            loc = new Windows.Devices.Geolocation.Geolocator();
        }
        if (loc != null) {
            loc.getGeopositionAsync().then(getPositionHandler, errorHandler);
        }
    }

    function getPositionHandler(pos) {
        global_lat = pos.coordinate.point.position.latitude;
        global_long = pos.coordinate.point.position.longitude;
        global_acc = pos.coordinate.accuracy;
        global_status = getStatusString(loc.locationStatus);
    }

    function errorHandler(e) {
        document.getElementById('errormsg').innerHTML = e.message;
        // Display an appropriate error message based on the location status.
        document.getElementById('geolocatorStatus').innerHTML =
            getStatusString(loc.locationStatus);
    }

    function getStatusString(locStatus) {
        switch (locStatus) {
            case Windows.Devices.Geolocation.PositionStatus.ready:
                // Location data is available
                return "Location is available.";
                break;
            case Windows.Devices.Geolocation.PositionStatus.initializing:
                // This status indicates that a GPS is still acquiring a fix
                return "A GPS device is still initializing.";
                break;
            case Windows.Devices.Geolocation.PositionStatus.noData:
                // No location data is currently available 
                return "Data from location services is currently unavailable.";
                break;
            case Windows.Devices.Geolocation.PositionStatus.disabled:
                // The app doesn't have permission to access location,
                // either because location has been turned off.
                return "Your location is currently turned off. " +
                    "Change your settings through the Settings charm " +
                    " to turn it back on.";
                break;
            case Windows.Devices.Geolocation.PositionStatus.notInitialized:
                // This status indicates that the app has not yet requested
                // location data by calling GetGeolocationAsync() or 
                // registering an event handler for the positionChanged event. 
                return "Location status is not initialized because " +
                    "the app has not requested location data.";
                break;
            case Windows.Devices.Geolocation.PositionStatus.notAvailable:
                // Location is not available on this version of Windows
                return "You do not have the required location services " +
                    "present on your system.";
                break;
            default:
                break;
        }
    }

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var testglobalvariable = "This is global";
    var global_lat = 0;
    var global_long = 0;
    var global_status = 0;
    var global_acc = 0;
    var loc = null;
    getLoc();

    app.addEventListener("activated", function (args) {
        app.onactivated = function (args) {
            if (args.detail.kind === activation.ActivationKind.launch) {

                args.setPromise(WinJS.UI.processAll().
                    done(function () {

                        // Add an event handler to the button.
                        document.querySelector("#getLocation").addEventListener("click",
                            getLoc);
                    }));
            }
        };

        
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application was suspended and then terminated.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
            }

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(p);
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
