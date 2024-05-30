'user strict';

const DB = require('../database');
const { Model } = require("objection");
const knex = require('../../database/knex');
const Config = require('../config/variable_constants');

class ChatRepository{

    constructor(app) {
        this.db = DB;
        Model.knex(knex);
    }

    async store(data)
    {
        let threadId = null;
        await knex('user_threads').where({sender_id: data.sender_id, receiver_id: data.receiver_id})
            .orWhere({sender_id: data.receiver_id, receiver_id: data.sender_id}).first()
            .then( async (thread) => {
                if(!thread) {
                    threadId = this.createThread(data).then((newThreadId) => {
                        return newThreadId
                    });
                } else {
                    threadId = thread.id;
                    this.updateThread(threadId, data.message)
                }
                return this.insertChatMessage(threadId, data);
            })
    }

    async createThread(data)
    {
        return await knex('user_threads').insert({
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            created_at: Config('variable_constants.date.current_date'),
        }).then((thread) => {
            return thread.id;
        })
    }

    async updateThread(threadId, message)
    {
        return await knex('user_threads').where({id: threadId}).update({
            message: message,
            updated_at: Config('variable_constants.date.current_date')
        })
    }

    async insertChatMessage(threadId, data)
    {
        return await knex('chat_messages').insert({
            threadId: threadId,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            created_at: Config('variable_constants.date.current_date'),
        });
    }
}

module.exports = new ChatRepository()