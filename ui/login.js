
var submit = document.getElementById('login_btn');

submit.onclick = function()
{
    
    var mobileInput = document.getElementById('mobile');
    var mobile = mobileInput.value;
    var pswInput = document.getElementById('psw');
    var password = pswInput.value;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(request.readyState === XMLHttpRequest.DONE)
            {
                if(request.status === 200)
                    {
                       var names = request.responseText;
                       names = JSON.parse(names); 
                        var list = ''
                        
                        for (var i = 0;i<names.length ;i++)
                            {
                                list  += '<li>' + names[i]["email"] + '</li>'
                            }
                        var ul = document.getElementById('name_list');
                        ul.innerHTML = list;  
                    }
                else
                {
                    alert("Email already Exist");
                }
            }
    }
    request.open('POST' , '/submitName?name='+name , true);
    request.send(JSON.strinfigy({mobile : mobile , password : password}));
}