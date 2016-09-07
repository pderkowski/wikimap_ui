import os
import shutil
from whoosh.fields import Schema, NGRAMWORDS, STORED, TEXT
from whoosh import index
from whoosh.qparser import SimpleParser

class Index(object):
    def __init__(self):
        self.schema = Schema(title=NGRAMWORDS(minsize=1), title_=TEXT(stored=True), x=STORED, y=STORED)
        self.parser = SimpleParser("title", schema=self.schema)

    def load(self, dataPath):
        print 'Loading index for {}...'.format(dataPath)

        # REMOVE IT WHEN THIS CLASS STARTS WORKING
        if os.path.exists("index"):
            if os.path.isdir("index"):
                shutil.rmtree("index")
            else:
                os.remove("index")

        if not os.path.isdir("index"):
            print "Index not found, creating..."
            os.mkdir("index")
            self.index = index.create_in("index", self.schema)

            with open(dataPath, 'r') as data:
                writer = self.index.writer()

                for line in data:
                    words = line.split()
                    x = float(words[0])
                    y = float(words[1])
                    title = words[2][1:-1].replace('_', ' ') # skip quotes and replace underscores with spaces for natural presentation
                    title = unicode(title, "utf8")
                    writer.add_document(title=title, title_=title, x=x, y=y)

                writer.commit(optimize=True)
        else:
            print "Index found, loading..."
            self.index = index.open_dir("index")

        print "Finished loading index!"

    def search(self, string):
        q = self.parser.parse(string)

        with self.index.searcher() as s:
            results = s.search(q, limit=5)
            return [{ 'title': r['title_'], 'x': r['x'], 'y': r['y'] } for r in results]

index_ = Index()