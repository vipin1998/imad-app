console.log('login.js loaded')
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
                       alert('Login Success');
                    }
                else if(request.status === 500)
                {
                    alert('Something went Wrong');
                }
                else if(request.status === 403)
                {
                    alert("Invalid data");
                }
            }
    };
    var mobileInput = document.getElementById('mobile');
    var mobile = mobileInput.value;
    var pswInput = document.getElementById('psw');
    var password = pswInput.value;
    request.open('POST' , '/login' , true);
    request.setRequestHeader('Content-Type' , 'application/json');
    request.send(JSON.stringify({mobile : mobile , password : password}));
};