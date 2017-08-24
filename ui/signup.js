var getOtp = document.getElementById('getotpbtn');

getOtp.onclick = function() {
    document.getElementById("signup_mobile").disabled = true;
    document.getElementById("signup_psw").disabled = true;
    document.getElementById("getotpbtn").disabled = true;
    document.getElementById("otp").disabled = false;
    document.getElementById("signupbtn").disabled = false;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(request.readyState === XMLHttpRequest.DONE)
            {
                if(request.status === 200)
                    {
                       alert('OTP sent Successfuly');
                    }
                else
                {
                    alert('Something went Wrong');
                }
            }
    };
    var mobileInput = document.getElementById('signup_mobile');
    var mobile = mobileInput.value;
    console.log(mobile);
    
    request.open('POST' , '/send-otp' , true);
    request.setRequestHeader('Content-Type' , 'application/json');
    request.send(JSON.stringify({mobile : mobile }));
    return false;




}


var submit = document.getElementById('signupbtn');

submit.onclick = function()
{
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(request.readyState === XMLHttpRequest.DONE)
            {
                if(request.status === 200)
                    {
                       alert('Registeration Success Please Login');
                    }
                else if(request.status === 403)
                {
                    alert('OTP did not match');
                }
                else if(request.status === 404)
                {
                    alert("Mobile Number Already Exist");
                }
            }
    };
    var mobileInput = document.getElementById('signup_mobile');
    var mobile = mobileInput.value;
    var pswInput = document.getElementById('signup_psw');
    var password = pswInput.value;
    var otpInput = document.getElementById("otp");
    var otp = otpInput.value;
    
    request.open('POST' , '/verify-otp' , true);
    request.setRequestHeader('Content-Type' , 'application/json');
    request.send(JSON.stringify({mobile : mobile , password : password , otp : otp}));
    return false;
};