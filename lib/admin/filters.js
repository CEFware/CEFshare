renderTmp = function (template, data) {
   var node = document.createElement("div");
   node.setAttribute('id','renderedId');
   document.body.appendChild(node);
   UI.renderWithData(template, data, node);
   return node;
};
