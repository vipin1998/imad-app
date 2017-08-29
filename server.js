var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

/*
var speakeasy = require("speakeasy");
var secret = speakeasy.generateSecret({length: 20});


const API_KEY = '171243A759wkov9CRb599d2a6c';
const SENDER_ID = "VERIFY";
const ROUTE_NO = 4;
var msg91 = require("msg91")(API_KEY, SENDER_ID, ROUTE_NO );
*/


var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({
    secret : "SomeRandomString",
    cookie : { maxAge : 1000*60*60*24*30 }
}));

var config = {
    user : 'vipindhangar1998',
    database : 'vipindhangar1998',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};

var pool = new Pool(config);


function createTemplate(data) {
  var title = data.title;
  var date = data.date;
  var category = data.category_id;
  var content = data.content;
  var article_id = data.article_id;
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
                        ${title}
                    </h3>
                    <div>
                        ${date.toDateString()}
                    </div>
                    <br/>
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
                                                        all_comments += '<li>' + comments[i]["content"] + '</li>'
                                                    }
                                                var ul = document.getElementById('comment_list');
                                                ul.innerHTML =all_comments ;  
                                            }
                                    }
                            }
                            var url = '/submitComment/${article_id}?comment='+comment
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

app.get('/ui/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});

app.get('/ui/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'signup.html'));
});



app.get('/ui/login.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.js'));
});

app.get('/ui/signup.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'signup.js'));
});

function hash (input , salt)
{
    var hashed = crypto.pbkdf2Sync(input , salt ,10000 , 512 ,'sha512');
    return ['pbkdf2','10000',salt ,hashed.toString('hex')].join('$');
}

/*
app.post('/send-otp' , function (req,res)
{
    var mobile = req.body.mobile;
    var token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
    var OTP = token.toString();

    var MESSAGE = "Welcome to VipinApp. your OTP is "+OTP;
    
    msg91.send(mobile, MESSAGE, function(err, response){
        res.json({
            "message" : "Otp is sent successfully"
        })
    });

})


app.post('/verify-otp' , function (req,res)
{
    var otp = req.body.otp;
    var mobile = req.body.mobile;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password , salt) ;
    var tokenValidates = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: otp,
        window: 6
    });
    if(tokenValidates ==- true)
    {
        //res.send('success');
    
        pool.query('INSERT INTO users (mobile , password ) VALUES ($1,$2)' , [mobile , dbString] , function (err ,result)
        {
            if(err)
            {
                res.status(404).send(err.toString());
            }
            else
            {
                res.send('Reg Success');
            }
        });
    }
    else
    {
        res.status(403).send("OTP did not match");
    }
});
*/

app.post('/create-user' , function (req,res)
{
   var mobile = req.body.mobile;
   var password = req.body.password;
   var name = req.body.name;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password , salt) ;
   pool.query('INSERT INTO users (mobile , password , name ) VALUES ($1,$2,$3)' , [mobile , dbString , name] , function (err ,result)
   {
      if(err)
      {
          res.status(404).send(err.toString());
      }
      else
      {
          res.send('Reg Success');
      }
   });
});


app.post('/login' , function (req,res)
{
   var mobile = req.body.mobile;
   var password = req.body.password;
   pool.query('SELECT * FROM users WHERE mobile = $1 ' , [mobile] , function (err ,result)
   {
      if(err)
      {
          res.status(500).send(submit_err.toString());
      }
      else
      {
          if(result.rows.length === 0)
          {
              res.status(403).send('No users Found');
          }
          else
          {
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password,salt);
              if(hashedPassword === dbString)
              {
                  req.session.auth = { userId : result.rows[0].user_id }
                  res.status(200).send('Login Success')
              }
              else
              {
                  res.status(403).send('No users Found');
              }
          }
      }
   });
});


app.get('/welcome' , function(req , res)
{
    if(req.session && req.session.auth && req.session.auth.userId )
    {
        pool.query('select * from users where user_id = $1',[req.session.auth.userId] , function(err , result){
            if(err)
                {
                    res.status(500).send(err.toString());
                }
                else
                {
                    res.send(JSON.stringify(result.rows[0]));
                }
        });
    }
    else
    {
        res.status(404).send('You are logged Out');
    }
});

app.get('/logout' , function(req , res)
{
    delete req.session.auth;
    //res.send('You are logout');
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


var counter = 0;
app.get('/counter' , function (req , res)
{
    counter = counter + 1;
    res.send(counter.toString());
});


app.get('/submitName' , function(req,res)
{
    var email = req.query.name;
    pool.query("INSERT INTO email (email) VALUES ('" + email + "')" , function (submit_err )
    {
       if(submit_err)
       {
           res.status(500).send(submit_err.toString());
       }
       else
       {
           pool.query('SELECT email FROM email' , function (err , result)
           {
               res.send(JSON.stringify(result.rows));
           });
       }
    });
});

app.get('/submitComment/:article_id' , function(req,res)
{
    var article_id = req.params.article_id;
    var comment = req.query.comment;
    pool.query("INSERT INTO comment (article_id , content , user_id ) VALUES ($1,$2,1)",[article_id,comment] , function(err)
    {
       if(err)
       {
           res.status(500).send(err.toString());
       }
       else
       {
           pool.query('SELECT content FROM comment WHERE article_id = $1' , [article_id] , function (err , result)
           {
               res.send(JSON.stringify(result.rows));
           });
       }
    });
    
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
app.get('/articles/:articleName' , function(req ,res)
{
  var article_name = req.params.articleName;
  pool.query("SELECT * FROM article WHERE title = $1" , [article_name] ,  function (err , result)
  {
      if(err)
      {
          res.status(500).send(err.toString());
      }
      else
      {
          if(result.rows.length === 0)
          {
              res.status(404).send('Article not Found');
          }
          else
          {
              var articleData = result.rows[0];
              res.send(createTemplate(articleData));
              
          }
      }
  });
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
