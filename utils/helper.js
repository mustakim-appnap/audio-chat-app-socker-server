'user strict';

const DB = require('./database');
const path = require('path');
const fs = require('fs');
const { Model } = require("objection");
const User = require('../models/User');
const knex = require('../database/knex');
const { isEmpty, result } = require('lodash');
const { response } = require('express');
const moment = require("moment");
const Config = require('./config/variable_constants');

class Helper{
    constructor(app) {
        this.db = DB;
        Model.knex(knex);
    }

    async updateUserStatus(userId, socketId)
    {
        try {
            return await User.query()
                .where({id: userId}).update({socket_id: socketId, is_active: Config.activation.active});
             
        } catch (error) {
            console.log(error);
			return null;
        }
    }

    async logoutUser(userId, socketId)
    {
        try {
            await User.query().where({id:userId}).update({
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
            await User.query().select('id', 'avatar', 'username').where({id: userId}).first();
        } catch (error) {
            console.log(error);
			return null;
        }
    }

}

module.exports = new Helper()