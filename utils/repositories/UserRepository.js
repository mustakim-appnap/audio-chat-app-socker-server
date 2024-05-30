'user strict';

const DB = require('../database');
const { Model } = require("objection");
const knex = require('../../database/knex');
const Config = require('../config/variable_constants');
const CommonHelper = require('../helpers/CommonHelper');

class UserRepository{

    constructor(app) {
        this.db = DB;
        Model.knex(knex);
    }

    async updateUserStatus(userId, socketId)
    {
        try {
            return await knex('users').where({id: userId}).update({socket_id: socketId, is_active: Config.activation.active});
             
        } catch (error) {
            console.log(error);
			return null;
        }
    }

    async logoutUser(userId)
    {
        try {
            return await knex('users').where({id:userId}).update({
                socket_id: null,
                is_active: Config.activation.inactive,
            });
        } catch (error) {
            console.log(error);
			return null;
        }
    }

    async getUserInfo(userId)
    {
        try {
            return await knex('users').select('id', knex.raw(`CONCAT('${CommonHelper.assetBaseUrl()}', '${Config.asset_path.user_avatar}', avatar) AS avatar`), 'username', 'is_premium').where({id: userId}).first();
        } catch (error) {
            console.log(error);
			return null;
        }
    }

    async updateChannelStatus(data, userCount)
    {
        try {
            await knex('public_active_channels').where({channel_id: data.channel}).first().then( async (currentChannel) => {
                if(currentChannel) {
                    await knex('public_active_channels').where({channel_id: data.channel}).update({
                        user_count: userCount,
                        is_active: userCount >= 1 ? Config.activation.active : Config.activation.inactive,
                        updated_at: Config('variable_constants.date.current_date'),
                    })
                } else {
                    await knex('public_active_channels').insert({
                        channel_id: data.channel,
                        user_count: userCount,
                        is_active:  Config.activation.active,
                        created_at: Config('variable_constants.date.current_date'),
                    })
                }
            })
        } catch (error) {
            console.log(error);
			return null;
        }
    }

    async getCurrentRoomUsers(users)
    {
        try {
            return await knex('users as u').select('u.id', knex.raw(`CONCAT('${CommonHelper.assetBaseUrl()}', '${Config.asset_path.user_avatar}', u.avatar) AS avatar`), 'u.username', 'u.is_premium', 'uo.model as outfit_model')
                .leftJoin('user_outfits as uo', 'uo.user_id', 'u.id').whereIn('u.id', users);
        } catch (error) {
            console.log(error);
			return null;
        }
    }

    async addChannelJoiningHistory(data)
    {
        try {
            return await knex('user_channel_join_history').where({channel_id: data.channel, user_id: data.user_id, type: data.type}).first().then( async (userJoined) => {
                if(userJoined) {
                    await knex('user_channel_join_history').where({channel_id: data.channel, user_id: data.user_id, type: data.type}).update({
                        'updated_at': Config('variable_constants.date.current_date'),
                    });
                } else {
                    await knex('user_channel_join_history').insert({
                        channel_id: data.channel,
                        type: data.type,
                        user_id: data.user_id,
                        created_at: Config('variable_constants.date.current_date'),
                    })
                }
            });
            
        } catch (error) {
            console.log(error);
			return null;
        }
    }

    async removeChannelJoiningHistory(data)
    {
        try {
            return await knex('user_channel_join_history').where({channel_id: data.channel, user_id: data.user_id}).delete();
        } catch (error) {
            console.log(error);
			return null;
        }
    }

}

module.exports = new UserRepository()