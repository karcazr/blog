(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');
  var post = document.querySelector('.post');

  function highlightMarkedWords(root) {
    if (!root) return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var parent = node.parentNode;

        if (!parent || /^(CODE|PRE|SCRIPT|STYLE|TEXTAREA)$/i.test(parent.nodeName)) {
          return NodeFilter.FILTER_REJECT;
        }

        return node.nodeValue.indexOf('==') >= 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    var nodes = [];
    var node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    nodes.forEach(function(textNode) {
      var text = textNode.nodeValue;
      var parts = text.split(/(==[^=]+==)/g);

      if (parts.length === 1) return;

      var fragment = document.createDocumentFragment();

      parts.forEach(function(part) {
        if (/^==[^=]+==$/.test(part)) {
          var mark = document.createElement('mark');
          mark.textContent = part.slice(2, -2);
          fragment.appendChild(mark);
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  highlightMarkedWords(post);

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);
})(document);
