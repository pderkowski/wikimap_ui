#!/usr/bin/env python

import os
import logging
from wikimap_ui import init_term_index

DATA_PATH = "./data"

def main():
    init_term_index(os.path.realpath(DATA_PATH))

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
