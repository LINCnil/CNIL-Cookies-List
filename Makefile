RSA_KEY_SIZE = 2048

all: clean firefox chrome
.PHONY: all clean firefox chrome id

clean:
	rm -rf build/ release/ manifests/manifest-cr-pub.json pubkey.b64.txt

packaging_key.pem:
	openssl genrsa -out "$@" "$(RSA_KEY_SIZE)"

pubkey.b64.txt: packaging_key.pem
	openssl rsa -in "$<" -pubout -outform DER 2>/dev/null | base64 -w0 >pubkey.b64.txt

id: packaging_key.pem
	@openssl rsa -in "$<" -pubout -outform DER 2>/dev/null | sha256sum | head -c32 | tr '0-9a-f' 'a-p'
	@echo

manifests/manifest-cr-pub.json: pubkey.b64.txt
	jq --ascii-output --arg key "$(shell cat 'pubkey.b64.txt')" '. + {key: $$key}' manifests/manifest-cr.json >manifests/manifest-cr-pub.json

chrome: packaging_key.pem manifests/manifest-cr-pub.json
	mkdir -p build/chrome release/
	rm -rf build/chrome/* release/chrome-*
	cp manifests/manifest-cr-pub.json build/chrome/manifest.json
	cp -r src/* build/chrome/
	chromium --pack-extension=build/chrome --pack-extension-key="$<"
	mv build/chrome.crx release/

firefox:
	mkdir -p build/firefox release/
	rm -rf build/firefox/* release/firefox-*
	cp manifests/manifest-fx.json build/firefox/manifest.json
	cp -r src/* build/firefox/
	cd build/firefox; zip -r ../../release/firefox-not-signed.zip .