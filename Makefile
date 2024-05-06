firefox: manifests/manifest-fx.json
	mkdir -p build/firefox release/
	rm -rf build/firefox/* release/firefox-*
	cp manifests/manifest-fx.json build/firefox/manifest.json
	cp -r src/* build/firefox/
	zip -r release/firefox-not-signed.zip build/firefox/

chrome: manifests/manifest-cr.json
	mkdir -p build/chrome release/
	rm -rf build/chrome/* release/chrome-*
	cp manifests/manifest-cr.json build/chrome/manifest.json
	cp -r src/* build/chrome/
	chromium --pack-extension=build/chrome
	mv build/chrome.crx build/chrome.pem release/

clean:
	rm -rf build/ release/

all: clean firefox chrome
