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
    ZoomWrapper(const py::list& points, const py::list& data, int pointsPerTile)
    : zoom_(std::make_shared<Zoom>(to_std_vector<Point2D>(points), to_std_vector<Data>(data), pointsPerTile))
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

private:
    std::shared_ptr<Zoom> zoom_;
};


BOOST_PYTHON_MODULE(libzoompy) {
    py::class_<Points2D>("Points2D")
        .def(py::vector_indexing_suite<Points2D>());

    py::class_<Points3D>("Points3D")
        .def(py::vector_indexing_suite<Points3D>());

    py::class_<Datapoints>("Datapoints")
        .def(py::vector_indexing_suite<Datapoints>());

    py::class_<ZoomWrapper, boost::noncopyable>("Zoom", py::init<const py::list&, const py::list&, int>())
        .def("getDatapoints", &ZoomWrapper::getDatapoints)
        .def("getMaxDepth", &ZoomWrapper::getMaxDepth)
        .def("getBounds", &ZoomWrapper::getBounds);

    py::class_<Data>("Data", py::init<const std::string&>())
        .def_readwrite("name", &Data::name)
        .def("__eq__", &Data::operator ==);

    py::class_<Datapoint>("Datapoint", py::init<const Point3D&, const Data&>())
        .def_readwrite("point", &Datapoint::point)
        .def_readwrite("data", &Datapoint::data)
        .def("__eq__", &Datapoint::operator ==);

    py::class_<Point2D>("Point2D", py::init<double, double>())
        .def(py::init<double, double>())
        .def_readwrite("x", &Point2D::x)
        .def_readwrite("y", &Point2D::y)
        .def("__eq__", &Point2D::operator ==);

    py::class_<Point3D>("Point3D", py::init<double, double, double>())
        .def(py::init<double, double, double>())
        .def_readwrite("x", &Point3D::x)
        .def_readwrite("y", &Point3D::y)
        .def_readwrite("z", &Point3D::z)
        .def("to2D", &Point3D::to2D)
        .def("__eq__", &Point3D::operator ==);

    py::class_<Range>("Range", py::init<const Point2D&, const Point2D&>())
        .def_readwrite("topLeft", &Range::topLeft)
        .def_readwrite("bottomRight", &Range::bottomRight);

    py::class_<Index>("Index", py::init<int, int, int>())
        .def_readwrite("x", &Index::x)
        .def_readwrite("y", &Index::y)
        .def_readwrite("level", &Index::level)
        .def("__eq__", &Index::operator ==);
}