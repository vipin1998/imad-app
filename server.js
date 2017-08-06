var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('dev'));

var articles =
{ 
    'articleOne' : 
    {
      title : 'Article-one',
      heading : 'Article-one',
      date : 'August 6 , 2017',
      content : `
                    <p>
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                    </p>
                    <p>
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                    </p>
                    <p>
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                        This is content of Article one. This is content of Article one.
                    </p>
                  `
    },
    'articleTwo' : 
    {
      title : 'Article-two',
      heading : 'Article-two',
      date : 'August 6 , 2017',
      content : `
                    <p>
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                    </p>
                    <p>
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                    </p>
                    <p>
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                        This is content of Article two. This is content of Article two.
                    </p>
                  `
    },
    'articleThree' : 
    {
      title : 'Article-three',
      heading : 'Article-three',
      date : 'August 6 , 2017',
      content : `
                    <p>
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                    </p>
                    <p>
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                    </p>
                    <p>
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                        This is content of Article three. This is content of Article three.
                    </p>
                  `
    }

};

function createTemplate(data) {
  var title = data.title;
  var date = data.date;
  var heading = data.heading;
  var content = data.content;

  var htmltemplate = `
        <html>
            <head>
                <title>
                    ${title}
                </title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link href="/ui/style.css" rel="stylesheet" />

            </head>
            <body>
                <div class="container">

                    <div>
                        <a href="/">Home</a>
                    </div>
                    <hr/>
                    <h3>
                        ${heading}
                    </h3>
                    <div>
                        ${date}
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
            </body>
        </html>
        `;
        return htmltemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
}); 

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/:articleName' , function(req ,res)
{
  var article_name = req.params.articleName;
  res.send(createTemplate(articles[article_name]));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
