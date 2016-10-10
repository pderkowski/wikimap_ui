#!/usr/bin/env python
from app import createApp
import argparse
import os

app = createApp('points', 'categories')

# def main():
#     # parser = argparse.ArgumentParser()
#     # parser.add_argument('--port', '-p', default=5000, type=int, help="a port used by the app", dest='port')
#     # parser.add_argument("data_path", help="a path to the data file")

#     # args = parser.parse_args()

#     # if os.path.isfile(args.data_path):
#     app = createApp('final')
#     app.run(debug=False, host='0.0.0.0', port=5000)
#     # else:
#     #     print 'Could not open "{}".'.format(args.data_path)

if __name__=="__main__":
    app.run(debug=False, host='0.0.0.0', port=5000)
