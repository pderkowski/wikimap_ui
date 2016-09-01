#!/usr/bin/env python
from app import createApp
import argparse
import os

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("data_path", help="a path to the data file")
    args = parser.parse_args()

    if os.path.isfile(args.data_path):
        app = createApp(args.data_path)
        app.run(debug=False)
    else:
        print 'Could not open "{}".'.format(args.data_path)

if __name__=="__main__":
    main()