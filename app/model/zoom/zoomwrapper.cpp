#include <boost/python.hpp>
#include <boost/python/stl_iterator.hpp>
#include <boost/python/suite/indexing/vector_indexing_suite.hpp>
#include "zoom.hpp"
#include "bounds.hpp"
#include "point.hpp"

namespace py = boost::python;

typedef Grid::Axis Axis;

template<typename T>
inline
std::vector<T> to_std_vector(const py::list& iterable) {
    return std::vector<T>(py::stl_input_iterator<T>(iterable), py::stl_input_iterator<T>());
}

class ZoomWrapper {
public:
    ZoomWrapper(const py::list& points, int pointsPerTile)
    : zoom_(std::make_shared<Zoom>(to_std_vector<Point>(points), pointsPerTile))
    { }

    Points getPoints(const Range& range, int zoomLevel) const {
        return zoom_->getPoints(range, zoomLevel);
    }

    Axes getGrid(const Range& range, int zoomLevel) const {
        return zoom_->getGrid(range, zoomLevel);
    }

private:
    std::shared_ptr<Zoom> zoom_;
};


BOOST_PYTHON_MODULE(libzoompy) {
    py::class_<Points>("Points")
        .def(py::vector_indexing_suite<Points>());

    py::class_<ZoomWrapper, boost::noncopyable>("Zoom", py::init<const py::list&, int>())
        .def("getPoints", &ZoomWrapper::getPoints)
        .def("getGrid", &ZoomWrapper::getGrid);

    py::class_<Point>("Point", py::init<double, double>())
        .def_readwrite("x", &Point::x)
        .def_readwrite("y", &Point::y)
        .def("__eq__", &Point::operator ==);

    py::class_<Axis>("Axis")
        .def(py::vector_indexing_suite<Axis>());

    py::class_<Axes>("Axes")
        .def_readwrite("x", &Axes::x)
        .def_readwrite("y", &Axes::y);

    py::class_<Range>("Range", py::init<const Point&, const Point&>())
        .def_readwrite("topLeft", &Range::topLeft)
        .def_readwrite("bottomRight", &Range::bottomRight);
}