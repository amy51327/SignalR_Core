"use strict";
//enter user name
var person = prompt("Please enter your name");
var id = '';
//set user name
if (person != null) {
    document.getElementById("userInput").innerHTML = person ;
    document.getElementById("userInput").value = person;   
}

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();



//連接成功
connection.start().then(function () {

    //add user    
    var user = document.getElementById("userInput").value;
    connection.invoke("UserConnected", user).catch(function (err) {
        return console.error(err.toString());
    });

}).catch(function (err) {
    return console.error(err.toString());
});


//送訊息至server

document.getElementById("messageInput")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            var user = document.getElementById("userInput").value;
            var message = document.getElementById("messageInput").value;
            connection.invoke("SendMessage", user, message).catch(function (err) {
                return console.error(err.toString());
            });
            event.preventDefault();
        }
    });
//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});

//server傳回
//show訊息
connection.on("ReceiveMessage", function (user, message) {
    $("#messagesList").append(`<div><span class="word_darkblue">public string </span>
<span class="word_yellow">${user}</span>()<br>{<br><div class="message_content">
<span class="word_purple">return </span><span class="word_orange">"${message}"</span>;</div>}</div>`);


});
//add user list
connection.on("AddUser", function (user) {
    //重新載入user列表
    updateUserList();

    $("#messagesList")
        .append(`<div><span class="word_blue">Console</span>.<span class="word_yellow">WriteLine</span>
                 <span>(</span><span class="word_orange">"${user.name}加入聊天室"</span><span>);</span>`);     

});
//remove user list
connection.on("RemoveUser", function (removeName, userList) {
    //重新載入user列表
    updateUserList();
    $("#messagesList").append(`<div class="word_green">//Console.WriteLine("${removeName}離開聊天室");</div>`);


});

//重整最新user列表
connection.on("UsetList", function (userlist) {
    var content = '';
    for (let value of userlist) {
        content += `<div class="user"><img src="/images/csharp-icon.png">Chat_${value}.cs</div>`
    }
    $('#userList').html(content);
});





function updateUserList() {
    connection.invoke("GetLastestUsetList").catch(function (err) {
        return console.error(err.toString());
    });

}