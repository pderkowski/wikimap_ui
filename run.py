#!/usr/bin/env python
from app import createApp
import os

app = createApp(os.path.realpath('data'))

if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=5000)
