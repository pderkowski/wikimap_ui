#include <boost/python.hpp>
#include <boost/python/stl_iterator.hpp>
#include <boost/python/suite/indexing/vector_indexing_suite.hpp>
#include "zoom.hpp"
#include "bounds.hpp"
#include "point.hpp"
#include "indexer.hpp"

namespace py = boost::python;

template<typename T>
inline
std::vector<T> to_std_vector(const py::list& iterable) {
    return std::vector<T>(py::stl_input_iterator<T>(iterable), py::stl_input_iterator<T>());
}

class ZoomWrapper {
public:
    ZoomWrapper(const py::list& datapoints, int pointsPerTile)
    : zoom_(std::make_shared<Zoom>(to_std_vector<Datapoint>(datapoints), pointsPerTile))
    { }

    Datapoints getDatapoints(const Index& index) const {
        return zoom_->getDatapoints(index);
    }

    Range getBounds() const {
        return zoom_->getBounds();
    }

    int getMaxDepth() const {
        return zoom_->getMaxDepth();
    }

    Index getIndexById(int id) const {
        return zoom_->getIndexById(id);
    }

private:
    std::shared_ptr<Zoom> zoom_;
};


BOOST_PYTHON_MODULE(libzoompy) {
    py::class_<Datapoints>("Datapoints")
        .def(py::vector_indexing_suite<Datapoints>());

    py::class_<ZoomWrapper, boost::noncopyable>("Zoom", py::init<const py::list&, int>())
        .def("getDatapoints", &ZoomWrapper::getDatapoints)
        .def("getMaxDepth", &ZoomWrapper::getMaxDepth)
        .def("getIndexById", &ZoomWrapper::getIndexById)
        .def("getBounds", &ZoomWrapper::getBounds);

    py::class_<Datapoint>("Datapoint", py::init<double, double, int>())
        .def(py::init<const Point&, int>())
        .def_readwrite("p", &Datapoint::p)
        .def_readwrite("id", &Datapoint::id)
        .def("__eq__", &Datapoint::operator ==);

    py::class_<Point>("Point", py::init<double, double>())
        .def_readwrite("x", &Point::x)
        .def_readwrite("y", &Point::y)
        .def("__eq__", &Point::operator ==);

    py::class_<Range>("Range", py::init<const Point&, const Point&>())
        .def_readwrite("topLeft", &Range::topLeft)
        .def_readwrite("bottomRight", &Range::bottomRight);

    py::class_<Index>("Index", py::init<int, int, int>())
        .def_readwrite("x", &Index::x)
        .def_readwrite("y", &Index::y)
        .def_readwrite("z", &Index::z)
        .def("__eq__", &Index::operator ==);
}