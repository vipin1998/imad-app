
var submit = document.getElementById('login_btn');

submit.onclick = function()
{
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(request.readyState === XMLHttpRequest.DONE)
            {
                if(request.status === 200)
                    {
                       alert('Login Success Go To Home');
                    }
                else if(request.status === 500)
                {
                    alert('Something went Wrong');
                }
                else if(request.status === 403)
                {
                    alert("Invalid username/password");
                }
            }
    };
    var mobileInput = document.getElementById('mobile');
    var mobile = mobileInput.value;
    var pswInput = document.getElementById('psw');
    var password = pswInput.value;
    request.open('POST' , 'http://vipindhangar1998.imad.hasura-app.io/login' , true);
    request.setRequestHeader('Content-Type' , 'application/json');
    request.send(JSON.stringify({mobile : mobile , password : password}));
    return false;
};