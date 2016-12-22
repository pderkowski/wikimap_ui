JSDIR = app/static/scripts
JSSOURCES = $(wildcard $(JSDIR)/*.js)

WEBPACK = $(realpath node_modules/.bin/webpack)

.DEFAULT_GOAL := build

.PHONY: build js clean

js: $(JSSOURCES)
	cd $(realpath $(JSDIR)) && \
	$(WEBPACK)

build: js
