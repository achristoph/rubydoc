// Generated by CoffeeScript 1.6.3
(function() {
  chrome.storage.local.get('version', function(data) {
    var version;
    version = data.version ? data.version : '2.1.1';
    return $.get("http://ruby-doc.org/core-" + version + "/index.html", function(a) {
      var html;
      html = $.parseHTML(a);
      return $.each(html, function(i, el) {
        var classes, methods;
        if ($(el).attr('class') === 'wrapper hdiv') {
          classes = $(el).find('div#class-index div.entries a').map(function() {
            var href, text;
            text = $(this).text();
            href = $(this).attr('href');
            return {
              label: text,
              href: href
            };
          }).get();
          chrome.storage.local.set({
            'classes': classes
          }, function() {
            return console.log("" + classes.length + " classes saved");
          });
          methods = $(el).find('div#method-index div.entries a').map(function() {
            var href, text;
            text = $(this).text();
            href = $(this).attr('href');
            return {
              label: text,
              href: href
            };
          }).get();
          return chrome.storage.local.set({
            'methods': methods
          }, function() {
            return console.log("" + methods.length + " methods saved");
          });
        }
      });
    });
  });

}).call(this);

/*
//@ sourceMappingURL=run.map
*/
