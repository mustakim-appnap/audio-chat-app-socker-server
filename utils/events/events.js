//  Event Names for Chat Service
module.exports = Object.freeze({

    SOCKET: {
        CONNECTION: 'connection',
        DISCONNECT: 'disconnect',
    },

    REDIS: {
        SUBSCRIBE : 'pmessage',
    },

    USER: {
        FRIEND_REQUEST: 'friend_request',
        FRIEND_REQUEST_ACCEPT: 'friend_request_accept',
        NOTIFICATION: 'user_notification',
    },

    CHANNEL: {
        JOIN_CHANNEL: 'join_channel',
        LEAVE_CHANNEL: 'leave_channel',
        USER_JOINED: 'user_joined',
        USER_LEFT: 'user_left',
        SEND_EMOJI: 'send_emoji',
        RECEIVE_EMOJI: 'receive_emoji',
        SEND_SOUND: 'send_sound',
        RECEIVE_SOUND: 'receive_sound',
        SEND_AI_VOICE: 'send_ai_voice',
        RECEIVE_AI_VOICE: 'receive_ai_voice',
        MAX_USER_LIMIT: 'max_user_limit',
    },

    CHATTING: {
        JOIN_CHAT_ROOM: 'join_chat_room',
        ROOM: 'room',
        SEND_MESSAGE: 'send_message',
        RECEIVE_MESSAGE: 'receive_message',
    }

});