const getFrontPageHtml = noteCount => {
    return`
      <! DOCTYPE html>
      <html>
        <head>
        </head>
        <body>
          <div class='container'>
            <h1>
            <p>number of notes created ${noteCount}</p>
            <a href='/notes'>notes</a>
            <img src='kuva.png' width='200' />
          </div>
        </body>
      </html>
  `
  }

function getFrontPageHtml(noteCount) {
    return`
      <! DOCTYPE html>
      <html>
        <head>
        </head>
        <body>
          <div class='container'>
            <h1>
            <p>number of notes created ${noteCount}</p>
            <a href='/notes'>notes</a>
            <img src='kuva.png' width='200' />
          </div>
        </body>
      </html>
  `
}

  
  app.get('/', (req, res) => {
    const page = getFrontPageHtml(notes.length)
    res.send(page);
  });


//----------------------------------------------------------------------------
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note) {
      var li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementById('notes').appendChild(ul)
  }
}

xhttp.open('GET','/data.json', true)
xhttp.send ()