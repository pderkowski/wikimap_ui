var SelectionBoxDrawer = function (wikimap) {
  var that = this;

  var selections = [];

  this.add = function (name) {
    if (selections.indexOf(name) < 0){
      selections.push(name);
      addSelectionNode(name);
    }
  };

  this.remove = function (name) {
    var index = selections.indexOf(name);
    if (index >=0) {
      selections.splice(index, 1);
      removeSelectionNode(index);
    }
  };

  function addSelectionNode(name) {
    var list = document.getElementById('selections-list');
    var newLI = document.createElement('li');

    newLI.innerHTML = createSelectionNode(name);
    newLI.addEventListener('click', function () {
      wikimap.removeCategory(name);
    });

    list.appendChild(newLI);
    setTimeout(function() {
      newLI.className = newLI.className + " show";
    }, 10);
  }

  function createSelectionNode(name) {
    var html = "<div>"
    html += name;
    html += "<button type=button class=selections-close-button><span class=selection=close-icon>&#10006;</span></button>";
    html += "</div>";
    return html;
  }

  function removeSelectionNode(index) {
    var list = document.getElementById('selections-list');
    var removedLi = list.childNodes[index];
    list.removeChild(removedLi);
  }
};

module.exports = SelectionBoxDrawer;