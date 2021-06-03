"use strict";
//enter user name
window.onload = function () {
    enterNameFunction();
}

function enterNameFunction() {
    var name = prompt('Enter Your Name');
    if (name !== null && name.match(/^ *$/) === null) {
        document.getElementById("userInput").innerHTML = name;
        document.getElementById("userInput").value = name;
    }
    else {
        enterNameFunction()
    }
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
        var message = this.value;
        if (event.keyCode === 13 && message.replace(/\s/g, '').length) {
            var user = document.getElementById("userInput").value;
            connection.invoke("SendMessage", user, message).catch(function (err) {
                return console.error(err.toString());
            });
            this.value = '';
            event.preventDefault();
        }
    });

//server傳回
//show訊息
connection.on("ReceiveMessage", function (user, message) {
    $("#messagesList").append(`<div><span class="word_darkblue">public string </span>
<span class="word_yellow">${user}</span>()<br>{<br><div class="message_content">
<span class="word_purple">return </span><span class="word_orange">"${message}"</span>;</div>}</div>`);

    scrollToEnd();
});
//add user list
connection.on("AddUser", function (user) {
    //重新載入user列表
    updateUserList();

    $("#messagesList")
        .append(`<div><span class="word_blue">Console</span>.<span class="word_yellow">WriteLine</span>
                 <span>(</span><span class="word_orange">"${user.name}加入聊天室"</span><span>);</span>`);
    scrollToEnd();
});
//user離線
connection.on("UserOffline", function (removeName) {
    //重新載入user列表
    updateUserList();
    $("#messagesList").append(`<div class="word_green">//Console.WriteLine("${removeName}離開聊天室");</div>`);
    scrollToEnd();
});

//重整最新user列表
connection.on("UsetList", function (userlist) {
    var content = '';
    for (let value of userlist) {
        content += `<div class="user"><img src="/images/csharp-icon.png">Chat_${value}.cs</div>`
    }
    $('#userList').html(content);
});

window.onresize = function () {
    changeheigth();
}

function changeheigth() {
    document.getElementById('chat_content').style.height = window.innerHeight - 230 + 'px';
}
function updateUserList() {
    connection.invoke("GetLastestUsetList").catch(function (err) {
        return console.error(err.toString());
    });
}
// keep scrollbar always at bottom
function scrollToEnd() {
    var messagesList = document.getElementById("messagesList");
    messagesList.scrollTop = messagesList.scrollHeight;
}