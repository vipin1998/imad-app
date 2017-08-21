console.log('Loaded!');

//Submit Comment


// Move the image

var img = document.getElementById('madi');

var marginLeft = 0;

function moveRight()
{
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft + 'px'
}


img.onclick = function ()
{ 
    var interval = setInterval(moveRight,50)
}


var button = document.getElementById('counter');

button.onclick = function()
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(request.readyState === XMLHttpRequest.DONE)
            {
                if(request.status === 200)
                    {
                        var counter = request.responseText;
                        var elem = document.getElementById('count');
                        elem.innerHTML  = counter.toString(); 
                    }
            }
    }
    request.open('GET' , '/counter' , true);
    request.send(null); 
};


//submit name

var submit = document.getElementById('submit')

submit.onclick = function()
{
    
    var nameInput = document.getElementById('name')
    var name = nameInput.value;
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
    request.open('GET' , '/submitName?name='+name , true);
    request.send(null);
}
