
/**
 * 初始化环信
 * @type {connection|*}
 */
var conn = new WebIM.connection({
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});


/**
 * 环信用户密码
 * @param user
 * @param pwd
 * @constructor
 */
function EasemobUtil(user, pwd) {
    let options = {
        apiUrl: WebIM.config.apiURL,
        user: user,
        pwd: pwd,
        appKey: WebIM.config.appkey
    };
    conn.open(options);
}

/**
 * 监听环信消息
 */
conn.listen({
    onOpened: function(message) {
        console.log('opened', message);
    },
    onClosed: function(message) {
        console.log('连接关闭回调')
    }, //连接关闭回调
    onTextMessage: function(message) {
        console.log('收到文本消息', message);
        showMessage(message,'txt')
    }, //收到文本消息
    onEmojiMessage: function(message) {}, //收到表情消息
    onPictureMessage: function(message) {
        console.log('收到图片消息', message);
    }, //收到图片消息
    onCmdMessage: function(message) {
        console.log('收到命令消息', message)
    }, //收到命令消息
    onAudioMessage: function(message) {
        console.log('收到音频消息', message);
    }, //收到音频消息
    onLocationMessage: function(message) {}, //收到位置消息
    onFileMessage: function(message) {}, //收到文件消息
    onVideoMessage: function(message) {
        console.log('收到视频消息');
    }, //收到视频消息
    onPresence: function(message) {}, //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function(message) {}, //处理好友申请
    onInviteMessage: function(message) {}, //处理群组邀请
    onOnline: function() {}, //本机网络连接成功
    onOffline: function() {}, //本机网络掉线
    onError: function(message) {
        console.log('失败回调', message)
    }, //失败回调
    onBlacklistUpdate: function(list) { //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    }
});

/**
 * 环信发送消息
 * @param to
 * @param message
 * @param type
 */
var sendPrivateText = function (to, message, type) {
    let id = conn.getUniqueId();                 // 生成本地消息id
    console.log(id);
    let msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
        msg: message,
        to: to,
        roomType: false,
        success: function (id, serverMsgId) {
            // console.log('send private text Success');
            let chatAdmin = '<div style="clear: both;width: 100%;">'+
                '<div class="admin-chat">'+
                '<span class="user"></span>'+
                '<div class="text">' + message + '</div>'+
                '</div>'+
                '</div>';
            $('#message'+ to).append(chatAdmin);

        }
    });
    msg.body.chatType = 'singleChat';
    conn.send(msg.body);
};

/**
 * 发送消息
 * @param to
 * @param message
 * @param type
 */
var sendMessage = function(to, message, type){
    sendPrivateText(to, message, type)
};


/**
 * 收到消息展示
 * @param message
 * @param type
 */
function showMessage(message, type) {
    // 接收到的消息
    let from = message.from;
    if(type === 'txt') {
        $('#message'+ from).append('<div style="clear: both;"><div class="user-chat">' + message.data + '</div></div>');
    } else if(type === 'img') {
        // $('#message'+ from).append('<div><span class="user"></span><div class="user"><img class="msg-img" src="' + message.url + '"></div></div>');
    } else if(type === 'audio') {

    }
}
