var target=encodeURIComponent(location.href);
chrome.extension.sendRequest({getLocal: "qrsize"}, function(response) {
  qrsize=response.qrsize;
  formula="http://chart.apis.google.com/chart?cht=qr&chs="+qrsize+"x"+qrsize+"&chl="+target;
  $("body").prepend('<div id="stickyqrextension"><div><img src='+formula+' id="qrCode" /></div></div>');
});



