PROGDIR = app/model/zoom
PROGSOURCES = $(PROGDIR)/bounds.cpp $(PROGDIR)/node.cpp $(PROGDIR)/partitiontree.cpp $(PROGDIR)/zoom.cpp
WRAPSOURCES = $(PROGDIR)/zoomwrapper.cpp

MODELDIR = app/model

TESTDIR = test
TESTSOURCES = $(wildcard test/*.cpp)

TESTOBJECTS = $(patsubst %.cpp, %.o, $(TESTSOURCES))
PROGOBJECTS = $(patsubst %.cpp, %.o, $(PROGSOURCES))
WRAPOBJECTS = $(patsubst %.cpp, %.o, $(WRAPSOURCES))

CXX = g++
CXXFLAGS  = -I$(PROGDIR) -std=c++11 -fPIC

PYTHON = /usr/include/python2.7

BINDIR = bin
LIBDIR = lib/python

BIN = $(BINDIR)/run_tests
LIB = $(LIBDIR)/libzoompy.so

export PYTHONPATH := $(realpath $(LIBDIR)):$(realpath $(MODELDIR)):$(PYTHONPATH)

.DEFAULT_GOAL := $(LIB)

.PHONY: test clean

$(WRAPOBJECTS): CXXFLAGS += -I$(PYTHON)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $^

$(BIN): $(PROGOBJECTS) $(TESTOBJECTS)
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) -o $(BIN) $^

$(LIB): $(PROGOBJECTS) $(WRAPOBJECTS)
	@mkdir -p $(@D)
	$(CXX) $^ -shared -lboost_python -o $(LIB)

test: $(BIN) $(LIB)
	./$(BIN)
	./$(TESTDIR)/test_python_bindings.py

clean:
	rm -f $(TESTOBJECTS) $(PROGOBJECTS) $(WRAPOBJECTS) $(BIN) $(LIB)