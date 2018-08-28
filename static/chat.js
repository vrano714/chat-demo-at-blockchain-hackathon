var myname = "";

var socket = new WebSocket('ws://' + server_location + '/chat');
socket.onopen = function(event){
    console.log("connected");
}
socket.onclose = function(){
    console.log("disconnected");
}
socket.onmessage = function(event){
    document.getElementById("header").innerText = "latest sync: " + (new Date()).toString();

    console.log(event.data);

    var recv_data = JSON.parse(event.data);
    if (recv_data["status"] == "new_realtime_message"){
        add_realtime_message(recv_data["data"]);
    }else if (recv_data["status"] == "new_chain_message"){
        add_chain_message(recv_data["data"]);
    }else if (recv_data["status"] == "like"){
        update_like(recv_data["data"]);
    }else if (recv_data["status"] == "logged_realtime_message"){
        add_message_log(recv_data["data"]);
    }
}

function add_realtime_message(data){
    var d = new Date();
    var h = d.getHours();
    if (h < 10){
        h = "0" + d.getHours();
    }
    var m = d.getMinutes();
    if (m < 10){
        m = "0" + d.getMinutes();
    }
    console.log("realtime message!!");

    var div_to_add = $(
        '<div></div>',
        {
            id: data.id,
            "class": "message__item message__item--bot",
            "onclick": "send_like('" + data.id + "');"
        }
    );
    var name = $(
        '<p>' + data.name + ' <span class="time">(' + h + ':' + m + ')</span></p>'
    );
    var opinion = $(
        '<span>' + data.content + '</span>'
    );
    
    if (myname == data.name){
        div_to_add.attr("class", "message__item message__item--user");
    }else{
        div_to_add.attr("class", "message__item message__item--bot");
    }
    
    if (myname == data.name){
        opinion.attr("class", "message message--user fukidashi");
    }else{
        opinion.attr("class", "message message--bot fukidashi");
    }
    
    if (myname != data.name){
        name.attr("class", "sender_name");
        name.appendTo(div_to_add);
    }else{
        name = $(
            '<p class="sender_name_me"><span class="time">(' + h + ':' + m + ')</span></p>'
        );
        name.appendTo(div_to_add);
    }
    
    opinion.appendTo(div_to_add);
    div_to_add.appendTo($("#real_time"));
    
    // $("real_time").scrollTop($("real_time").height());
}

function add_chain_message(data){
    console.log("chain message!");

    var div_to_add = $(
        '<div></div>',
        {
            "class": "message__list",
        }
    );
    var name = $(
        '<p>' + data.transaction.name + '</p>'
    );
    var opinion = $(
        '<span>' + data.transaction.content + '</span>'
    );
    var hash_top = data.previous_hash.slice(
        0,
        data.previous_hash.length/2
    );
    var hash_tail = data.previous_hash.slice(
        data.previous_hash.length/2,
        data.previous_hash.length
    );
    var phash = $(
        '<br/><span>' + hash_top + '</br>' + hash_tail + '</span>'
    );
    phash.attr("class", "phash");
    
    if (myname == data.transaction.name){
        div_to_add.attr("class", "message__item message__item--user");
    }else{
        div_to_add.attr("class", "message__item message__item--bot");
    }
    
    if (myname == data.transaction.name){
        opinion.attr("class", "message message--user");
        opinion.css(
            "border",
            "1px solid #eeeeee"
        );
    }else{
        opinion.attr("class", "message message--bot");
    }
    
    if (myname != data.transaction.name){
        name.attr("class", "sender_name");
        name.appendTo(div_to_add);
    }
    
    opinion.appendTo(div_to_add);
    phash.appendTo(div_to_add);
    div_to_add.appendTo($("#chain"));
}

function update_like(data){
    // TODO: Write this function
}

function add_message_log(data){
    console.log("message log before I join");
    var div_to_add = $(
        '<div></div>',
        {
            id: data.id,
            "class": "message__item message__item--bot",
            "onclick": "send_like('" + data.id + "');"
        }
    );
    var name = $(
        '<p>' + data.name + ' <span class="time">(log)</span></p>'
    );
    var opinion = $(
        '<span>' + data.content + '</span>'
    );
    
    if (myname == data.name){
        div_to_add.attr("class", "message__item message__item--user");
    }else{
        div_to_add.attr("class", "message__item message__item--bot");
    }
    
    if (myname == data.name){
        opinion.attr("class", "message message--user fukidashi");
    }else{
        opinion.attr("class", "message message--bot fukidashi");
    }
    
    if (myname != data.name){
        name.attr("class", "sender_name");
        name.appendTo(div_to_add);
    }else{
        name = $(
            '<p class="sender_name_me"><span class="time">(log)</span></p>'
        );
        name.appendTo(div_to_add);
    }
    
    opinion.appendTo(div_to_add);
    div_to_add.appendTo($("#real_time"));
}

function generate_random_id(){
    var l = 12;
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
    
    $("#" + op_id + " span.fukidashi").css(
        "border",
        "2px solid #ff69b4"
    );
    
    // $("#" + op_id).removeAttr("onclick");
}

function send_new_message(){
    if ($('input[name="op_name"]').val() == ""){
        alert("fill name");
        return;
    }
    if ($('input[name="op_content"]').val() == ""){
        alert("fill content");
        return;
    }
    
    myname = $('input[name="op_name"]').val();
    
    var status = "new";
    var data = {
        "name": $('input[name="op_name"]').val(),
        "content": $('input[name="op_content"]').val(),
        "like": 0, 
        "id": generate_random_id()
    };
    console.log(data);
    send(status, data);
    
    $('input[name="op_content"]').val("");
}