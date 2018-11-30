PROJECT=dialog
CSS=\
	node_modules/@pirxpilot/overlay/overlay.css \
	dialog.css

all: check compile

check: lint

lint:
	jshint index.js

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	browserify --debug --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

build/build.css: $(CSS) | build
	cat $^ > $@

node_modules: package.json
	npm install

clean:
	rm -fr build node_modules

.PHONY: clean lint check all build
