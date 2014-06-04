/*jshint strict:false, browser:true */
(function() {
  var bookmarklet = {

    name: 'bookmarklet-alt-check',

    version: '0.0.1',

    url: 'https://github.com/ashizawa/bookmarklet-alt-check',

    styleCss: '#bookmarklet-alt-check {position: absolute;top: 0;left: 0;z-index: 999;padding: 5px;border: solid #ccc 1px;background: #fff;}' +
      '#bookmarklet-alt-check table {margin: 0;}' +
      '#bookmarklet-alt-check table tr {background: #f6f6f6;}' +
      '#bookmarklet-alt-check table tr.odd {background: #f2f2f2;}' +
      '#bookmarklet-alt-check table tr th {padding: 4px;text-align: center;font-weight: bold;}' +
      '#bookmarklet-alt-check table tr td {padding: 4px;}' +
      '#bookmarklet-alt-check table tr td.is_error {color: #f00;}' +
      '#bookmarklet-alt-check table tr td img.large {zoom:0.5;}' +
      '',

    contentTemplate: '<table><tr><th>img</th><th>alt</th><th>html size</th><th>original size</th></tr>' +
      '<@for(var i in this.img) {@>' +
      '<tr<@if (i % 2 == 0) {@> class="odd"<@}@>>' +
      '<td><img <@if(this.img[i].isLarge){@>class="large" <@}@>src="<@this.img[i].src@>" /></td>' +
      '<td<@if(this.img[i].alt=="empty"){@> class="is_error"<@}@>><@this.img[i].alt@></td>' +
      '<td<@if(this.img[i].html!=this.img[i].original){@> class="is_error"<@}@>><@this.img[i].html@></td>' +
      '<td><@this.img[i].original@></td>' +
      '</tr>' +
      '<@}@>' +
      '</table>',

    footerTemplate: '<div style="text-align:right;"><a href="<@this.url@>"><@this.name@> v<@this.version@></a></div>',

    /**
     * template code output
     * by http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
     *
     * @param html - template
     * @param options - variable
     * @return {String} - html object
     */
    templateCompile: function(html, options) {
      var re = /<@([^@>]+)?@>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
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

    /**
     * main
     */
    initialize: function() {
      if (document.getElementById(this.name)) {
        return;
      }
      window.scrollTo(0, 0);

      this.appendStyleSheet();
      this.createHtml();
    },

    /**
     * add stylesheet
     */
    appendStyleSheet: function() {
      var styleNode = document.createElement('style');
      styleNode.appendChild(document.createTextNode(this.styleCss));
      document.head.appendChild(styleNode);
    },

    /**
     * add html & click handler
     */
    createHtml: function() {
      var content = this.templateCompile(this.contentTemplate, this.convertTemplateObject(document.getElementsByTagName('img')));

      var wrapper = document.createElement('div');
      wrapper.id = this.name;
      var footer = this.templateCompile(this.footerTemplate, {url: this.url, name: this.name, version: this.version});
      document.getElementsByTagName('body')[0].appendChild(wrapper);
      wrapper.innerHTML = content + footer;
      wrapper.onclick = function(e) {
        var target = e.currentTarget;
        target.parentNode.removeChild(target);
      };
    },

    /**
     * convert object data.
     * @param obj - image elements
     * @return {{img: Array}}
     */
    convertTemplateObject: function(obj) {
      var arrayRef = {img: []};
      for (var i=0,max = obj.length; i < max; i++) {
        arrayRef.img.push({
          src: obj[i].src,
          alt: obj[i].alt || 'empty',
          html: obj[i].width + 'x' + obj[i].height,
          original: obj[i].naturalWidth + 'x' + obj[i].naturalHeight,
          isLarge: obj[i].naturalWidth < 400 ? 0 : 1
        });
      }
      return arrayRef;
    }

  };

  bookmarklet.initialize();

})(window);
