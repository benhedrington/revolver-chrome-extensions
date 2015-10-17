// Saves options to localStorage.
function save_options() {
	var feed = document.getElementById("feed").value;
	var seconds = document.getElementById("seconds").value;
	var max = document.getElementById("max").value;
	var auto = document.getElementById("auto").checked;
	// Update status to let user know options were saved.	
	chrome.storage.local.set({
    	feed: feed,
    	seconds: seconds,
    	max: max,
    	auto: auto
	}, function() {
		// update the current values
		var bg = chrome.extension.getBackgroundPage();
	  	bg.currUri = feed;
		bg.timeDelay = seconds * 1000;
		bg.maxItems = max;
    	// Update status to let user know options were saved.
    	var status = document.getElementById("status");
    	status.textContent = 'Options saved.';
    	setTimeout(function() {
      		status.textContent = '';
    	}, 750);
  });
}

// Restores saved values from localStorage.
function restore_options() {
	chrome.storage.local.get({
    	feed: 'http://rss.cnn.com/rss/cnn_topstories.rss',
    	seconds: 10,
    	max: 10,
    	auto: false
  	}, function(items) {
    	document.getElementById("feed").value = items.feed;
    	document.getElementById("seconds").value = items.seconds;
    	document.getElementById("max").value = items.max;
    	document.getElementById('auto').checked = items.auto;
  	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);