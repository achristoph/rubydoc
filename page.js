// Generated by CoffeeScript 1.6.3
(function() {
  var app;

  app = angular.module('app', ['ui.bootstrap']);

  app.controller('RubyDocCtrl', function($scope, $http) {
    chrome.storage.local.get('classes', function(data) {
      $scope.classes = data.classes;
      return console.log("" + data.classes.length + " classes retrieved");
    });
    chrome.storage.local.get('methods', function(data) {
      $scope.methods = data.methods;
      return console.log("" + data.methods.length + " methods retrieved");
    });
    chrome.storage.local.get('version', function(data) {
      if (data.version) {
        return $scope.$apply(function() {
          return $scope.version = data.version;
        });
      } else {
        return $scope.$apply(function() {
          return $scope.version = '2.1.1';
        });
      }
    });
    $scope.filter = function(type) {
      var href, url;
      if (type === 'method') {
        href = $scope.method.href;
      } else {
        href = $scope["class"].href;
      }
      url = "http://ruby-doc.org/core-" + $scope.version + "/" + href;
      return chrome.tabs.query({
        currentWindow: true,
        url: "http://*.ruby-doc.org/*"
      }, function(tabs) {
        if (tabs.length > 0) {
          return chrome.tabs.update(tabs[0].id, {
            url: url,
            active: true
          });
        } else {
          return chrome.tabs.create({
            url: url
          });
        }
      });
    };
    $scope.startsWith = function(data, viewValue) {
      return data.substr(0, viewValue.length).toLowerCase() === viewValue.toLowerCase();
    };
    return $scope.updateStorage = function() {
      return $http({
        url: "http://ruby-doc.org/core-" + $scope.version + "/index.html"
      }).success(function(a) {
        var html;
        html = $.parseHTML(a);
        return $.each(html, function(i, el) {
          var classes, methods;
          if ($(el).attr('class') === 'wrapper hdiv') {
            chrome.storage.local.set({
              'version': $scope.version
            }, function() {
              return console.log('version saved');
            });
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
              console.log("" + classes.length + " classes saved");
              return $scope.classes = classes;
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
              console.log("" + methods.length + " methods saved");
              return $scope.methods = methods;
            });
          }
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=page.map
*/
