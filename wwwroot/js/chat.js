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

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;


//連接成功
connection.start().then(function () {
    //送出訊息按鈕打開
    document.getElementById("sendButton").disabled = false;
    //add user
    var user = document.getElementById("userInput").value;
    connection.invoke("UserConnected", user).catch(function (err) {
        return console.error(err.toString());
    });

}).catch(function (err) {
    return console.error(err.toString());
});

//送訊息至server
document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

//server傳回
//show訊息
connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} says ${message}`;
});
//add user list
connection.on("AddUser", function (user) {        
    
    $("#messagesList")
        .append(`<li><span class="nametitle">${user.name}</span>加入聊天室</li>`);
    //重新載入user列表
    connection.invoke("GetLastestUsetList").catch(function (err) {
        return console.error(err.toString());
    });

});
//remove user list
connection.on("RemoveUser", function (removeName, userList) {
    //重新載入user列表
    updateUserList();
    document.getElementById("messagesList")
        .append(`<li><span class="nametitle">${removeName}</span>離開聊天室</li>`);

    connection.invoke("GetLastestUsetList").catch(function (err) {
        return console.error(err.toString());
    });
});

//重整最新user列表
connection.on("UsetList", function (userlist) {
    var content = '';
    for (let value of userlist) {
        content += `<li>${value}</li>`
    }
    $('#userList').html(content);
});





