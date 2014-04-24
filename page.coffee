app = angular.module('app', ['ui.bootstrap'])

app.controller 'RubyDocCtrl', ($scope,$http) ->

  chrome.storage.local.get('classes', (data) ->
    $scope.classes = data.classes
    console.log "#{data.classes.length} classes retrieved"
  )

  chrome.storage.local.get('methods', (data) ->
    $scope.methods = data.methods
    console.log "#{data.methods.length} methods retrieved"
  )

  chrome.storage.local.get('version', (data) ->
    if data.version
      $scope.$apply ()->
        $scope.version = data.version
    else
      $scope.$apply ()->
        $scope.version = '2.1.1'
  )

  $scope.filter = (type)->
    if type == 'method'
      href = $scope.method.href
    else
      href = $scope.class.href

    url = "http://ruby-doc.org/core-#{$scope.version}/#{href}"

    chrome.tabs.query({currentWindow: true, url: "http://*.ruby-doc.org/*"}, (tabs)->
      if tabs.length > 0
        chrome.tabs.update(tabs[0].id, {url: url, active: true})
      else
        chrome.tabs.create({url: url})
    )

  $scope.startsWith = (data, viewValue)->
    return data.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase()

  $scope.updateStorage = ()->
    $http({url: "http://ruby-doc.org/core-#{$scope.version}/index.html"}).success (a)->
      html = $.parseHTML(a)
      $.each(html, (i, el)->
        if $(el).attr('class') == 'wrapper hdiv'
          chrome.storage.local.set({'version': $scope.version}, ()->
            console.log 'version saved')

          classes = $(el).find('div#class-index div.entries a').map(()->
            text = $(this).text()
            href = $(this).attr('href')
            return {label: text, href: href}
          ).get()

          chrome.storage.local.set({'classes': classes}, ()->
            console.log "#{classes.length} classes saved"
            $scope.classes = classes
          )

          methods = $(el).find('div#method-index div.entries a').map(()->
            text = $(this).text()
            href = $(this).attr('href')
            return {label: text, href: href}
          ).get()

          chrome.storage.local.set({'methods': methods}, ()->
            console.log "#{methods.length} methods saved"
            $scope.methods = methods
          )
      )

