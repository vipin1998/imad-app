var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('dev'));

var config = {
    user : 'vipindhangar1998',
    database : 'vipindhangar1998',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};

var pool = new Pool(config);

var articles =
{ 
    'articleOne' : 
    {
      title : 'articleOne',
      heading : 'Article-one',
      date : 'August 6 , 2017',
      comments : [],
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
      title : 'articleTwo',
      heading : 'Article-two',
      date : 'August 6 , 2017',
      comments : [],
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
      title : 'articleThree',
      heading : 'Article-three',
      date : 'August 6 , 2017',
      comments : [],
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
                    <div>
                        <h3> Submit Comment </h3>
                        <input type="text" id="comment" placeholder="Enter Comment"></input>
                        <input type="submit" id="submit_comment" value="Submit"></input>
                        <script>
                        var submit = document.getElementById('submit_comment')
                        submit.onclick = function()
                        {
                            var commentInput = document.getElementById('comment')
                            var comment = commentInput.value;
                            var request = new XMLHttpRequest();
                            request.onreadystatechange = function()
                            {
                                if(request.readyState === XMLHttpRequest.DONE)
                                    {
                                        if(request.status === 200)
                                            {
                                            var comments = request.responseText;
                                            comments = JSON.parse(comments); 
                                                var all_comments = '';
                                                for(var i = 0;i<comments.length;i++)
                                                    {
                                                        all_comments += '<li>' + comments[i] + '</li>'
                                                    }
                                                var ul = document.getElementById('comment_list');
                                                ul.innerHTML =all_comments ;  
                                            }
                                    }
                            }
                            var url = '/submitComment/${title}?comment='+comment
                            request.open('GET' , url  , true);
                            request.send(null);
                        }
                        </script>
                    </div>
                    <div>
                        <h3> Comments </h3>
                        <ul id="comment_list"> </ul>

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

app.get('/testDb' , function (req,res)
{
    var name = req.query.name;
    pool.query('show name from name' , function(err , result)
    {
       if(err)
       {
           res.status(500).send(err.toString());
       }
       else
       {
           res.send(JSON.stringify(result.rows));
       }
       
    });
});


var counter = 0;
app.get('/counter' , function (req , res)
{
    counter = counter + 1;
    res.send(counter.toString());
});


app.get('/submitName' , function(req,res)
{
    var name = req.query.name;
    pool.query("INSERT INTO name (name) VALUES ('" + name + "')" , function (submit_err )
    {
       if(submit_err)
       {
           res.status(500).send(err.toString());
       }
       else
       {
           pool.query('SELECT name FROM name' , function (err , result)
           {
               res.send(JSON.stringify(result.rows));
           });
       }
    });
});

app.get('/submitComment/:article' , function(req,res)
{
    var article = req.params.article;
    var comment = req.query.comment;
    articles[article].comments.push(comment);
    res.send(JSON.stringify(articles[article].comments));
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
