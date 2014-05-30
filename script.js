(function() {
  var myName = 'bookmarklet-alt-check',
    version = '0.0.1',
    url = 'https://github.com/ashizawa/bookmarklet-alt-check';

  if (document.getElementById(myName)) {
    return;
  }

  var wrapper = document.createElement('div');
  var html = '<div style="text-align:right;"><a href="' + url + '">' + myName + ' v' + version + '</a></div>';

  getElements('body')[0].appendChild(wrapper);
  wrapper.innerHTML = html;

  wrapper.onclick = function() {
    this.parentNode.removeChild(this);
  };

  window.scrollTo(0, 0);
})();
