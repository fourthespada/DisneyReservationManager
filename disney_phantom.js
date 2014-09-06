// -- CONFIGURE ME -- //

var lookingFor = [
// Comment out the unnecessary restaurants
//  "'Ohana",
    "1900 Park Fare",
//    "Akershus Royal Banquet Hall",
//    "Candlelight Processional Dinner Package",
//    "Cape May Cafe",
//    "Chef Mickey's",
//    "Cinderella's Royal Table",
//    "The Crystal Palace",
//    "Fantasmic! Dinner Package",
//    "Fort Wilderness Pavilion",
//    "The Garden Grill",
//    "Garden Grove",
//    "Garden View Tea Room",
//    "Hollywood & Vine",
//    "Mickey's Backyard BBQ",
//    "My Disney Girl's Perfectly Princess Tea Party",
//    "Tusker House Restaurant",
    "---"];

var spartysize = '3';
var stime = 'Dinner';
var sdate = '11/21/2014';
var url = 'https://disneyworld.disney.go.com/dining/#/character-dining/';

// -- OVERRIDE DEFAULT VALUES IF ARGUMENTS ARE SUPPLIED -- //
var system = require('system');
var args = system.args;
if (args.length > 4) {
    spartysize = args[1];
    stime = args[2];
    sdate = args[3];
    lookingFor = [];
    for (var i = 4; i < args.length; i++) {
        lookingFor.push(args[i]);
    }
}

// -- CONFIGURABLES END -- //

// -- PROGRAM START -- //
var FAIL = "none";

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36';
page.settings.loadImages = false;
page.settings.resourceTimeout = 10000;


function logoutput(result) {
	if (result === FAIL) {
        console.log('NO_AVAILABILITY');
    } else if ( result == null ) {
        console.log('NULL_AVAILABILITY');
        page.render('log_lasterror.png');
    } else {
        console.log(result + ' availability found on ' + sdate);
        page.render('log_lastsuccess.png');
    }
}

page.open(url, function (status) {
	if (status !== 'success') {
		console.log('ERROR: Unable to access network :: ' + status);
        phantom.exit();
	} else {
        window.setTimeout(function () {
            page.evaluate(function (sdate, stime, spartysize) {

                document.querySelector('#diningAvailabilityForm-searchDate').value = sdate;
                $('select option[value="' + stime + '"]').prop('selected', true);
                $('select option[value="' + spartysize + '"]').prop('selected', true);
                var searchBtn = document.querySelector('#searchButton');
                
                // create a mouse click event on searchBtn
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, window, 1, 0, 0);
                searchBtn.dispatchEvent(event);
            }, sdate, stime, spartysize);
        }, 5000);  // give 5 seconds to run all the shitty page load JS          
                        
        //Step 2
        window.setTimeout(function () {
            //after the search completes
            //Find if ul-id has descendant div with the right aria-label
            var result = FAIL;
            result = page.evaluate(function (lookingFor, FAIL) {
                for (var i = 0; i < lookingFor.length; i++) {
                    if($('ul#withAvailability-alpha-default > li > div[aria-label="' + lookingFor[i] + '"]').length > 0)
                        return lookingFor[i];
                }
                return FAIL;
            }, lookingFor, FAIL);
            
            logoutput(result);
            phantom.exit(); 

        }, 15000);  // give 10 seconds for the shitty search to complete
	}
});

