#!/usr/bin/env python

import os
import logging
from wikimap_ui.models.data import Data
from wikimap_ui.models.terms import PageIndex, CategoryIndex
from itertools import izip, imap
from operator import itemgetter

DATA_PATH = "./data"

def main():
    init_term_index(os.path.realpath(DATA_PATH))

def init_term_index(data_path):
    data = Data(data_path)

    page_index = PageIndex()
    page_index.reset_index()
    page_index.add(data.getPageTitlesAndRanks())

    category_index = CategoryIndex()
    category_index.reset_index()
    category_index.add(data.getCategoryTitlesAndSizes())

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
