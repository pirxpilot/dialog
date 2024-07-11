PROJECT=dialog
CSS=dialog.css

all: check compile

check: lint

lint:
	jshint index.js

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	esbuild \
					--bundle \
					--sourcemap \
					--define:DEBUG="true" \
					--global-name=$(PROJECT) \
					--outfile=$@ \
					index.js

build/build.css: $(CSS) | build
	cat $^ > $@

node_modules: package.json
	npm install

clean:
	rm -fr build node_modules

.PHONY: clean lint check all build
