class Category(object):
    def __init__(self, ids):
        self.ids = ids

class Categories(object):
    def __init__(self, categoriesPath):
        self._title2category = {}

        with open(categoriesPath, 'r') as file:
            for line in file:
                words = line.split()
                title = unicode(words[0], encoding='utf8').replace('_', ' ')
                self._title2category[title] = map(int, words[1:])

    def getCategoryByTitle(self, title):
        return Category(ids=self._title2category[title])