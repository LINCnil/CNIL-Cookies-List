browser.browserAction.onClicked.addListener(loadPage);

function loadPage ()
{
	browser.tabs.create({"url": "/mainPage.html"});
}