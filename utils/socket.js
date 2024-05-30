const path = require('path');
var ioRedis = require('ioredis');
const events = require('./events/events');
const UserService = require('./service/UserService');
const Config = require('./config/variable_constants');
const UserRepository = require('./repositories/UserRepository');
const ChatRepository = require('./repositories/ChatRepository');

class Socket {

    constructor(socket) {
        this.io = socket;
        // this.redisPort = process.env.REDIS_PORT;
        // this.redisHost = process.env.REDIS_HOST;
        // this.redisPass = process.env.REDIS_PASSWORD;
        // this.redis = new ioRedis(this.redisPort, this.redisHost, { password: this.redisPass });
    }

    socketEvents() {
        this.io.on(events.SOCKET.CONNECTION, (socket) => {
            console.log('SOCKET CONNECTED');
            /** 
             * Join Channel Events
             * params: channel, user_id, channel_type(0/1)
             * */
            socket.on(events.CHANNEL.JOIN_CHANNEL, async (data) => {
                console.log(data);
                let currentRoomUserCount = this.getUserCountInRoom(data.channel);
                if(currentRoomUserCount < Config.public_channel.max_user) {
                    
                    /** Join User into channel */
                    socket.join(data.channel);
                    
                    /** Increase user count to the room */
                    UserService.userJoined(data.user_id, data.channel);
                    
                    let roomUserCount = this.getUserCountInRoom(data.channel);
                    /** Emit Room user count event */ 
                    this.broadcastEventToRoomUser(data, events.CHANNEL.USER_JOINED, roomUserCount);
                    
                    /**TODO:: Store join info into DB for public channels*/
                    if(data.type == Config.channel_type.public) {
                        console.log('userCount '+ roomUserCount);
                        UserService.updateChannelStatus(data, roomUserCount);
                    }
                    /** Track User Channel Joining */
                    UserService.addChannelJoiningHistory(data);
                    /**
                     * Client Events
                     * params: channel_id, channel, user_id, content
                     */
                    this.handleEmojiEvent(socket);
                    this.handleSoundEvent(socket);
                    this.handleAIVoiceEvent(socket);

                    /**
                     * Leave Channel Event
                     * params: channel, user_id, type
                     */
                    socket.on(events.CHANNEL.LEAVE_CHANNEL, async (data) => {
                        socket.leave(data.channel);
                        UserService.userLeft(data.user_id);
                        let roomUserCount = this.getUserCountInRoom(data.channel);
                        this.broadcastEventToRoomUser(data, events.CHANNEL.USER_LEFT, roomUserCount);
                        if(data.type == Config.channel_type.public) {
                            console.log('userCount '+ roomUserCount);
                            UserService.updateChannelStatus(data, roomUserCount);
                        }
                        
                    });
                } else {
                    this.handleMaxUserEvent(socket, data.channel);
                }
            });

            /**
             * Send Message
             */

            /** params user_id, friend_id */
            socket.on(events.CHATTING.JOIN_CHAT_ROOM, async (data) => {
                try {
                    let chatRoom =  `${events.CHATTING.ROOM}_${[data.user_id, data.friend_id].sort().join('_')}`
                    // `${events.CHATTING.ROOM}_${Math.min(data.user_id, data.friend_id)}_${Math.max(data.user_id, data.friend_id)}`
                    socket.join(chatRoom);

                    this.handleSendMessageEvent(socket, chatRoom);

                } catch (error) {
                    console.error('Error sending message:', error);
                }
            })
            /**
             * disconnect socket
             * params: user_id
             */
            socket.on(events.SOCKET.DISCONNECT, async (data) => {
                await UserRepository.logoutUser(data.user_id);
            });

        });
    }

    /**
     * Redis Bridge to subcribe channel and fire event to client
     * @param {*} socket 
     */
    // redisClient(socket)
    // {
    //     // Subscribe Events to Redis and broadcast event in specific User Groups

    //     this.redis.psubscribe('*', function(err, count) {
    //         console.log(count);
    //     });
        
    //     this.redis.on(events.REDIS.SUBSCRIBE, function(subscribed, channel, data) {
    //         let eventData = JSON.parse(data);
    //         // console.log(eventData);
    //         // console.log('channel: '+ channel);
    //         if (eventData.event === events.USER.FRIEND_REQUEST || eventData.event === events.USER.FRIEND_REQUEST_ACCEPT || eventData.event === events.USER.NOTIFICATION) {
    //             socket.to(eventData.data.socket_id).emit(eventData.event, eventData.data.status);
    //         } else {
                
    //         }
    //     });
    // }

    socketConfig() {
        this.io.use( async (socket, next) => {
            let userId = socket.handshake.query.user_id;
            console.log(userId);
            if(userId) {
                const response = await UserRepository.updateUserStatus(userId, socket.id);
                if(response && response != null) {
                next();
                } else {
                    console.error(`Socket connection failed, for  user Id ${userId}.`);
                }      
            } else {
                console.log('No user found');
            }
                  
        });
        this.socketEvents();
        // subscribe redis channel and fire events
        // this.redisClient(this.io);
    }

    getUserCountInRoom(roomName) {
        return UserService.getRoomUsers(roomName).length;
    }

    broadcastEventToRoomUser(data, userJoinedOrLeftEvent, roomUserCount) {
        if(data.user_id) {
            // UserRepository.getUserInfo(data.user_id).then(userInfo => {
            //     let userData = {
            //         user_count: roomUserCount,
            //         user: userInfo
            //     }
            //     console.log(userData);
            //     this.io.to(data.channel).emit(`${userJoinedOrLeftEvent}_${data.channel}`, userData);
            // });

            let users = UserService.getRoomUsers(data.channel).map(obj => obj.id);
            UserRepository.getCurrentRoomUsers(users).then(userInfo => {
                let userData = {
                    user_count: roomUserCount,
                    user: userInfo
                }
                console.log(userData);
                this.io.to(data.channel).emit(`${userJoinedOrLeftEvent}_${data.channel}`, userData);
            });
        }
    }

    handleEmojiEvent(socket) {
        /** params: content, user_id */
        socket.on(events.CHANNEL.SEND_EMOJI, async (data) => {
            console.log(data);
            this.io.to(data.channel).emit(`${events.CHANNEL.RECEIVE_EMOJI}_${data.channel}`, data.content);
        });
    }

    handleSoundEvent(socket) {
        /** params: content, user_id */
        socket.on(events.CHANNEL.SEND_SOUND, async (data) => {
            console.log(data);
            this.io.to(data.channel).emit(`${events.CHANNEL.RECEIVE_SOUND}_${data.channel}`, data.content);
        });
    }

    handleAIVoiceEvent(socket) {
        /** params: content, user_id */
        socket.on(events.CHANNEL.SEND_AI_VOICE, async (data) => {
            console.log(data);
            this.io.to(data.channel).emit(`${events.CHANNEL.RECEIVE_AI_VOICE}_${data.channel}`, data.content);
        });
    }

    /** When User Count exceeds the max user limit this event will fire */
    handleMaxUserEvent(socket, channel) {
        socket.emit(events.CHANNEL.MAX_USER_LIMIT, {
            channel: channel,
            message: Config.messages.max_user_error,
        });
    }

    handleSendMessageEvent(socket, room)
    {
        /** params: sender_id, receiver_id, message,  */
        socket.on(events.CHATTING.SEND_MESSAGE, async (data) => {
            this.io.to(room).emit(events.CHATTING.RECEIVE_MESSAGE, data);
            // Store Data In DB
            ChatRepository.store(data);
            
        });
    }
}

module.exports = Socket