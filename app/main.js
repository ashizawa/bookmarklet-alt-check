/*jshint strict:false, browser:true */
(function() {
  var bookmarklet = {

    myName: 'bookmarklet-alt-check',

    version: '0.0.1',

    url: 'https://github.com/ashizawa/bookmarklet-alt-check',

    /**
     * template code output
     * by http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
     *
     * @param html - template
     * @param options - variable
     * @return {String} - html object
     */
    templateCompile: function(html, options) {
      var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
      var add = function(line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
          (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
      };
      var match;
      while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
      }
      add(html.substr(cursor, html.length - cursor));
      code += 'return r.join("");';
      return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    },

    styleNode: document.createElement('style'),

    content: document.createTextNode('body { background: #fff; }'),

    initialize: function() {
      if (document.getElementById(bookmarklet.myName)) {
        return;
      }
      window.scrollTo(0, 0);

      this.styleNode.appendChild(this.content);
      document.head.appendChild(this.styleNode);

      var wrapper = document.createElement('div');
      var html = this.templateCompile('<div style="text-align:right;"><a href="<%this.url%>"><%this.name%> v<%this.version%></a></div>', {url: this.url, name: this.myName, version: this.version});
      document.getElementsByTagName('body')[0].appendChild(wrapper);
      wrapper.innerHTML = html;
      wrapper.onclick = function() {
        this.parentNode.removeChild(this);
      };
    }
  };

  bookmarklet.initialize();

})(window);
