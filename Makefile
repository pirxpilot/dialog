PROJECT=dialog
CSS=\
	node_modules/overlay-component/overlay.css \
	dialog.css

all: check compile

check: lint

lint:
	jshint index.js

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	browserify --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

build/build.css: $(CSS) | build
	cat $^ > $@

node_modules: package.json
	npm install

clean:
	rm -fr build node_modules

.PHONY: clean lint check all build
