chrome.storage.local.get('version', (data) ->
  version = if data.version then data.version else '2.1.1'

  $.get("http://ruby-doc.org/core-#{version}/index.html", (a)->
    html = $.parseHTML(a)
    $.each(html, (i, el)->
      if $(el).attr('class') == 'wrapper hdiv'
        classes = $(el).find('div#class-index div.entries a').map( ()->
           text = $(this).text()
           href = $(this).attr('href')
           return {label: text, href: href}
        ).get()
        chrome.storage.local.set({'classes':classes},()->console.log "#{classes.length} classes saved")

        methods = $(el).find('div#method-index div.entries a').map( ()->
          text = $(this).text()
          href = $(this).attr('href')
          return {label: text, href: href}
        ).get()
        chrome.storage.local.set({'methods':methods},()->console.log "#{methods.length} methods saved")
    )
  )
)