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
    "---"
]

var sdate = '11/21/2014';
var stime = 'Dinner';
var spartysize = '3';
var url = 'https://disneyworld.disney.go.com/dining/#/character-dining/';

var _FAIL = "none";

function logoutput(result) {
	if (result !== _FAIL) {
        console.log(result + ' availability found on ' + sdate);
        page.render('render-found.png');
    }
    else
    {
        console.log('NO_AVAILABILITY');
}

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
page.settings.loadImages = false;
page.settings.resourceTimeout = 10000;

//phantom.onError = function(msg, trace) {
//  var msgStack = ['PHANTOM ERROR: ' + msg];
//  console.log(msgStack.join('\n'));
//  phantom.exit(1);
//};

page.open(url, function(status) {
	if(status !== 'success') {
		console.log('ERROR: Unable to access network :: ' + status);
        phantom.exit();
	}
	else {
        window.setTimeout(function() {
            page.evaluate(function (sdate, stime, spartysize) {

                document.querySelector('#diningAvailabilityForm-searchDate').value = sdate;
                $('select option[value="' + stime + '"]').prop('selected', true);
                $('select option[value="' + spartysize + '"]').prop('selected', true);
                var searchBtn = document.querySelector('#searchButton');
                
                // create a mouse click event on searchBtn
                var event = document.createEvent( 'MouseEvents' );
                event.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
                searchBtn.dispatchEvent( event );
            }, sdate, stime, spartysize);
        }, 5000);  // give 5 seconds to run all the shitty page load JS          
                        
        //Step 2
        window.setTimeout(function() {
            //after the search completes
            //Find if ul-id has descendant div with the right aria-label
            var result = _FAIL;
            result = page.evaluate(function (lookingFor, _FAIL) {
                for(var i = 0; i < lookingFor.length; i++) {
                    if($('ul#withAvailability-alpha-default > li > div[aria-label="' + lookingFor[i] + '"]').length > 0)
                        return lookingFor[i];
                }
                return _FAIL;
            }, lookingFor, _FAIL);
            
            logoutput(result);
            phantom.exit(); 

        }, 15000);  // give 10 seconds for the shitty search to complete
	}
});

// BROWSER vs PHANTOMJS Difference: *-alpha-default vs *-default
//Find if ul-id has descendant div with the right aria-label
//if($('ul#withAvailability-default > li > div[aria-label=lookingFor]').length > 0) {
//alert('found');
//}

// BROWSER vs PHANTOMJS Difference:
//                //initiate Search
//                    document.querySelector('#diningAvailabilityForm-searchDate').value = '11/16/2014';
//                    document.querySelector('#searchTime-wrapper .rawOption').innerHTML = '<span class="accessibleText hidden">Time&nbsp;required - Opens menu - </span>Dinner';
//                    document.querySelector('#partySize-wrapper .rawOption').innerHTML = '<span class="accessibleText hidden">Party Size&nbsp;required - Opens menu - </span>3';
//                    document.querySelector('#searchButton').click();