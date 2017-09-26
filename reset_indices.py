#!/usr/bin/env python

import os
import argparse
import logging
from wikimap_ui.models.data import Data

def main():
    logging.basicConfig(level=logging.INFO)

    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--langs', '-l', nargs='+', dest='langs', type=str, required=True,
        help="Specify languages for which to reset indices. The names of the languages should correspond to subdirectories in a directory given by --datapath.")
    parser.add_argument('--delete_all', dest='delete_all', action='store_true',
        help="Delete all existing indices.")
    args = parser.parse_args()

    data = Data(os.path.realpath('data'))

    print 'Indices existing before this operation: ', data.list_indices()

    if args.delete_all:
        data.delete_all_indices()

    for lang in args.langs:
        data[lang].resetIndex()

    print 'Indices existing after this operation: ', data.list_indices()

if __name__ == "__main__":
    main()
