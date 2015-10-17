/*
Revolver - RSS 

2010-01-28 - Initial working alpha version
2015-10-17 - 0.2 Updated to manifest 2, include jquery, add context menu and auto start

Created by Ben Hedrington
Improved by Graham Brown
*/

console.log("Starting Revolver RSS");
// Global Variables - When possible pulling form Local Storage set via Options page.
var running = false;
var manifest = new Array();
var curr = -1;
var currTab = 0;

//var currUri = "http://rss.cnn.com/rss/cnn_topstories.rss";
var currUri = "https://script.google.com/a/macros/ledula.com/s/AKfycbz5LSEcAVD-tZW7_gAt3-qqin9W6Gi25OQKk4SODn1W/dev?sheet=Sheet4";
var timeDelay = 10000;
var maxItems = 10;
var autoStart = false;

chrome.storage.local.get({
   	feed: 'http://rss.cnn.com/rss/cnn_topstories.rss',
	seconds: 10,
  	max: 10,
   	auto: false
}, function(items) {
   	currUri = items.feed;
   	timeDelay = items.seconds * 1000;
   	maxItems = items.max;
   	autoStart = items.auto;
   	console.log("Revolver RSS Settings: feed: " + currUri + ", timeDelay: " + timeDelay + ", autoStart: " + autoStart);
});

// Setup Initial Badge Text
var badgeColor = [139,137,137,137];
chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
//chrome.browserAction.setBadgeText({text: 'off'});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	if (!running) {
		go(tab);
	} else {
		stop();
	}
});


var parentMenu = chrome.contextMenus.create({"title": "Revolver RSS"});

var menuItem = chrome.contextMenus.create({"parentId": parentMenu, "title": "Running", "type": "checkbox", "onclick":function(info, tab) {
		if (info.checked) {
			go(tab);
		} else {
			stop();
		}
	}
});

chrome.contextMenus.create({"parentId": parentMenu, "title": "Options", "type": "normal", "onclick":function(info, tab) {
	chrome.tabs.create({url: "options.html"});
}});

// Switch Tab URL functionality.
function swTab(tab, uri) {
	chrome.tabs.update(tab, {url: uri});
}

// Function grabs current tab and kicks off process.
function go(tab) {
	console.log("go()");
	if (running) return;
	running = true;
	console.log("go() - running = true");
	chrome.browserAction.setBadgeText({text: 'on'});
	chrome.contextMenus.update(menuItem, {checked: true});
	currTab = tab.id;
	pullReset();	
}

// Function pulls RSS feed, processes and adds to URL manifest for rotating.
function pullReset() {
	curr = -1;
	manifest = [];
	console.log("getting feed from " + currUri);
	jQuery.getFeed({
	   	url: currUri,
	   	success: function(feed) {
	        for(var i = 0; i < feed.items.length && i < maxItems; i++) {
		        var item = feed.items[i];
				manifest[i]=item.link;
	       	}
	       	console.log("feed items " + manifest.join(","));
			moveTab();
			moverInteval = setInterval(moveTab, timeDelay);
		}
	});
}

// Stops repetitive process and all processing.
function stop() {
	console.log("stop()");
	running = false;
	chrome.browserAction.setBadgeText({text: ''});
	chrome.contextMenus.update(menuItem, {checked: false});
	clearInterval(moverInteval);
}

// Switches to nex URL in manifest, re-requests feed if at end of manifest.
function moveTab() {
	if (running) {
		if (manifest.length > (curr+1)) {
			curr = curr+1;
			swTab(currTab,manifest[curr])
		} else {
			clearInterval(moverInteval);
			pullReset();
		}
	}
}

// if auto start kick it off - after 2 seconds
setTimeout(function() {
	console.log("Revolver RSS AutoStart: " + autoStart);
	if (autoStart) {
		console.log("Revolver RSS Auto Starting...");
		chrome.windows.getLastFocused(function(window) {
			chrome.tabs.query({lastFocusedWindow: true, windowType: 'normal', index: 0},
    			function(tabs) {
       		 		go(tabs[0]);
    			}
			);
		});
	}
}, 2000);
