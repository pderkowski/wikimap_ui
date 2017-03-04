#!/usr/bin/env python

import os
import logging
from wikimap_ui.models.data import Data
from wikimap_ui.models.terms import Terms
from itertools import izip, repeat, imap
from operator import itemgetter

DATA_PATH = "./data"

def main():
    init_term_index(os.path.realpath(DATA_PATH))

def mean(numbers):
    return float(sum(numbers)) / max(len(numbers), 1)

def init_term_index(data_path):
    data = Data(data_path)

    terms = Terms()
    terms.reset_index()

    datapoint_titles, ranks = [list(t) for t in zip(*data.getDatapointTitlesAndRanks())]
    terms.add(izip(datapoint_titles, repeat(False), ranks))
    terms.add(izip(imap(itemgetter(0), data.getCategoryTitles()), repeat(True), repeat(mean(ranks))))

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
