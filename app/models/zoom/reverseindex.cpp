#include "reverseindex.hpp"
#include <utility>
#include <stdexcept>

void ReverseIndex::mapId2Index(int id, const Index& index) {
    auto res = id2index_.insert(std::make_pair(id, index));
    if (!res.second) {
        throw std::runtime_error("Ids should be unique, so no duplicates are expected.");
    }
}

Index ReverseIndex::getIndexById(int id) const {
    return id2index_.at(id);
}