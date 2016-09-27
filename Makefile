ZOOMDIR = app/models/zoom
ZOOMSOURCES = $(ZOOMDIR)/bounds.cpp $(ZOOMDIR)/node.cpp $(ZOOMDIR)/partitiontree.cpp $(ZOOMDIR)/zoom.cpp $(ZOOMDIR)/indexer.cpp
WRAPSOURCES = $(ZOOMDIR)/zoomwrapper.cpp

TESTDIR = $(ZOOMDIR)/test
TESTSOURCES = $(wildcard $(TESTDIR)/*.cpp)

TESTOBJECTS = $(patsubst %.cpp, %.o, $(TESTSOURCES))
ZOOMOBJECTS = $(patsubst %.cpp, %.o, $(ZOOMSOURCES))
WRAPOBJECTS = $(patsubst %.cpp, %.o, $(WRAPSOURCES))

CXX = g++
CXXFLAGS  = -I$(ZOOMDIR) -std=c++11 -fPIC

PYTHON = /usr/include/python2.7

TESTBIN = $(TESTDIR)/bin/run_tests
ZOOMLIB = $(ZOOMDIR)/libzoompy.so

# export PYTHONPATH := $(realpath $(LIBDIR)):$(realpath $(MODELDIR)):$(PYTHONPATH)

.DEFAULT_GOAL := $(ZOOMLIB)

.PHONY: test clean

$(WRAPOBJECTS): CXXFLAGS += -I$(PYTHON)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $^

$(TESTBIN): $(ZOOMOBJECTS) $(TESTOBJECTS)
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) -o $(TESTBIN) $^

$(ZOOMLIB): $(ZOOMOBJECTS) $(WRAPOBJECTS)
	@mkdir -p $(@D)
	$(CXX) $^ -shared -Lexternal -lboost_python -lpython2.7 -o $(ZOOMLIB)

test: $(ZOOMLIB) $(TESTBIN)
	./$(TESTBIN)
	python -m unittest discover

clean:
	rm -f $(TESTOBJECTS) $(ZOOMOBJECTS) $(WRAPOBJECTS) $(TESTBIN) $(ZOOMLIB)