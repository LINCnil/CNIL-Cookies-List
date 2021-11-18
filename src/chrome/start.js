chrome.browserAction.onClicked.addListener(loadPage);

function loadPage ()
{
	chrome.tabs.create({"url": "/mainPage.html"});
}
