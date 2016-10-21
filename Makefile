ZOOMDIR = app/models/zoom
ZOOMSOURCES = $(ZOOMDIR)/bounds.cpp $(ZOOMDIR)/node.cpp $(ZOOMDIR)/partitiontree.cpp $(ZOOMDIR)/zoom.cpp $(ZOOMDIR)/indexer.cpp $(ZOOMDIR)/reverseindex.cpp
WRAPSOURCES = $(ZOOMDIR)/zoomwrapper.cpp

TESTDIR = $(ZOOMDIR)/test
TESTSOURCES = $(wildcard $(TESTDIR)/*.cpp)

TESTOBJECTS = $(patsubst %.cpp, %.o, $(TESTSOURCES))
ZOOMOBJECTS = $(patsubst %.cpp, %.o, $(ZOOMSOURCES))
WRAPOBJECTS = $(patsubst %.cpp, %.o, $(WRAPSOURCES))

EXTERNALDIR=external
EXTERNALINCLUDE=$(EXTERNALDIR)/include
EXTERNALLIB=$(EXTERNALDIR)/lib

BOOSTDIR=$(EXTERNALDIR)/boost

JSDIR = app/static/scripts
JSSOURCES = $(wildcard $(JSDIR)/*.js)

WEBPACK = $(realpath node_modules/.bin/webpack)

CXX = g++
CXXFLAGS  = -I$(ZOOMDIR) -I$(EXTERNALINCLUDE) -std=c++11 -fPIC

PYTHONVERSION = python2.7
PYTHONINCLUDE = /usr/include/$(PYTHONVERSION)

TESTBIN = $(TESTDIR)/bin/run_tests
ZOOMLIB = $(ZOOMDIR)/libzoompy.so

.DEFAULT_GOAL := build

.PHONY: test clean boost

$(WRAPOBJECTS): CXXFLAGS += -I$(PYTHONINCLUDE)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $^

boost:
	cd $(realpath $(BOOSTDIR)) && \
	./bootstrap.sh --with-python=/usr/bin/$(PYTHONVERSION) --with-libraries=python --prefix=$(realpath $(EXTERNALDIR)) && \
	./b2 install

$(TESTBIN): $(ZOOMOBJECTS) $(TESTOBJECTS)
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) -o $(TESTBIN) $^

$(ZOOMLIB): $(ZOOMOBJECTS) $(WRAPOBJECTS) boost
	@mkdir -p $(@D)
	$(CXX) $(ZOOMOBJECTS) $(WRAPOBJECTS) -shared -L$(EXTERNALLIB) -lboost_python -l$(PYTHONVERSION) -o $(ZOOMLIB)

js: $(JSSOURCES)
	cd $(realpath $(JSDIR)) && \
	$(WEBPACK)

build: $(ZOOMLIB) js

test: $(ZOOMLIB) $(TESTBIN)
	./$(TESTBIN)
	$(PYTHONVERSION) -m unittest discover

clean:
	rm -rf $(TESTOBJECTS) $(ZOOMOBJECTS) $(WRAPOBJECTS) $(TESTBIN) $(ZOOMLIB) $(EXTERNALLIB) $(EXTERNALINCLUDE)