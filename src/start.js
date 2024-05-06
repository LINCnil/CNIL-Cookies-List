chrome.action.onClicked.addListener(loadPage);

function loadPage () {
	chrome.tabs.create({"url": "/mainPage.html"});
}
