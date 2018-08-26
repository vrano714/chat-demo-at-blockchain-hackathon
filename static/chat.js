var socket = new WebSocket('ws://' + server_location + '/chat');
socket.onopen = function(event){
    console.log("connected");
}
socket.onclose = function(){
    console.log("disconnected");
}
socket.onmessage = function(event){
    document.getElementById("header").innerText = "latest sync: " + (new Date()).toString();
    var recv_data = JSON.parse(event.data);
    if (recv_data["status"] == "new_realtime_message"){
        add_realtime_message(recv_data["data"]);
    }else if (recv_data["status"] == "new_chain_message"){
        add_chain_message(recv_data["data"]);
    }else if (recv_data["status"] == "like"){
        update_like(recv_data["data"]);
    }
}

function add_realtime_message(data){
    console.log("realtime message!!");
    var div_to_add = $(
        '<div></div>',
        {
            id: data.id,
            "class": ".message__list",
            "onclick": "send_like('" + data.id + "');"
        }
    );
    var div_to_add2 = $(
        '<div></div>',
        {
            "class": ".message__item .message__item--bot"
        }
    );
    var name = $(
        '<span>' + data.name + ": " + '</span>',
        {
            "class": "message_name message message--bot"
        }
    );
    var content = $(
        '<span>' + data.content + '</span>',
        {
            "class": "message_content message message--bot"
        }
    );

    name.appendTo(div_to_add2);
    content.appendTo(div_to_add2);
    div_to_add2.appendTo(div_to_add);
    div_to_add.appendTo($("#real_time"));
}

function add_chain_message(data){
    // TODO: Write this function
    console.log("chain message!: ");
    console.log(data);

    var div_to_add = $(
        '<div></div>',
        {
            "class": ".message__list",
        }
    );
    var div_to_add2 = $(
        '<div></div>',
        {
            "class": ".message__item .message__item--bot"
        }
    );
    var name = $(
        '<span>' + data.transaction.name + ": " + '</span>',
        {
            "class": "message_name message message--bot"
        }
    );
    var content = $(
        '<span>' + data.transaction.content + '</span><br/>',
        {
            "class": "message_content message message--bot"
        }
    );
    var phash = $(
        '<span>' + data.previous_hash + '</span>',
        {
            "class": "message_content message message--bot phash"
        }
    );

    name.appendTo(div_to_add2);
    content.appendTo(div_to_add2);
    phash.appendTo(div_to_add2);
    div_to_add2.appendTo(div_to_add);
    div_to_add.appendTo($("#chain"));
}

function update_like(data){
    // TODO: Write this function
}

function generate_random_id(){
    // 生成する文字列の長さ
    var l = 12;

    // 生成する文字列に含める文字セット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";

    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
        r += c[Math.floor(Math.random()*cl)];
    }

    return r
}

function send(status, data){
    var mesg = {
        "status": status,
        "data": data
    };

    socket.send(JSON.stringify(mesg));
    console.log("sent!");
}

function send_like(op_id){
    // if ($("#" + op_id).attr("clicked") == "true"){
    //     alert("you already liked this message");
    //     return;
    // }
    console.log(op_id);
    var status = "like";
    var data = {
        "id": op_id
    };
    console.log(data);
    send(status, data);

    // $("#" + op_id).attr("clicked", "true");
}

function send_new_message(){
    if ($('textarea[name="op_name"]').val() == ""){
        alert("fill name");
        return;
    }
    if ($('textarea[name="op_content"]').val() == ""){
        alert("fill content");
        return;
    }
    var status = "new";
    var data = {
        "name": $('textarea[name="op_name"]').val(),
        "content": $('textarea[name="op_content"]').val(),
        "like": 0, 
        "id": generate_random_id()
    };
    console.log(data);
    send(status, data);
}