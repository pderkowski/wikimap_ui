ZOOMDIR = app/models/zoom
ZOOMSOURCES = $(ZOOMDIR)/bounds.cpp $(ZOOMDIR)/node.cpp $(ZOOMDIR)/partitiontree.cpp $(ZOOMDIR)/zoom.cpp $(ZOOMDIR)/indexer.cpp
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

CXX = g++
CXXFLAGS  = -I$(ZOOMDIR) -I$(EXTERNALINCLUDE) -std=c++11 -fPIC

PYTHONINCLUDE = /usr/include/python2.7

TESTBIN = $(TESTDIR)/bin/run_tests
ZOOMLIB = $(ZOOMDIR)/libzoompy.so

.DEFAULT_GOAL := $(ZOOMLIB)

.PHONY: test clean boost

$(WRAPOBJECTS): CXXFLAGS += -I$(PYTHONINCLUDE)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $^

boost:
	cd $(realpath $(BOOSTDIR)) && \
	./bootstrap.sh --with-libraries=python --prefix=$(realpath $(EXTERNALDIR)) && \
	./b2 install

$(TESTBIN): $(ZOOMOBJECTS) $(TESTOBJECTS)
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) -o $(TESTBIN) $^

$(ZOOMLIB): boost $(ZOOMOBJECTS) $(WRAPOBJECTS)
	@mkdir -p $(@D)
	$(CXX) $(ZOOMOBJECTS) $(WRAPOBJECTS) -shared -L$(EXTERNALLIB) -lboost_python -lpython2.7 -o $(ZOOMLIB)

test: $(ZOOMLIB) $(TESTBIN)
	./$(TESTBIN)
	python -m unittest discover

clean:
	rm -rf $(TESTOBJECTS) $(ZOOMOBJECTS) $(WRAPOBJECTS) $(TESTBIN) $(ZOOMLIB) $(EXTERNALLIB) $(EXTERNALINCLUDE)