#!/usr/bin/env python
from wikimap_ui import create_app
import os

app = create_app(os.path.realpath('data'))

if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=5000)
