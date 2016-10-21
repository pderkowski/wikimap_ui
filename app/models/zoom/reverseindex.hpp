#pragma once

#include "index.hpp"
#include <unordered_map>

class ReverseIndex {
public:
    void mapId2Index(int id, const Index& index);

    Index getIndexById(int id) const;

private:
    std::unordered_map<int, Index> id2index_;
};