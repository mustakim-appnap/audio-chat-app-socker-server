'use strict';

const Model = require('objection').Model;
const cursorMixin = require('objection-cursor');

const cursor = cursorMixin({
    pageInfo: {
        total: true,
        hasNext: true,
        hasPrevious: true,
        remaining: true,
    }
});



class User extends cursor(Model)
{
    static get tableName() {
        return 'users';
    }

    // Database Schema
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: {type: 'integer' },
                socketId: {type: 'string' },
                isActive: {type: 'boolean'},
                
            }
        };
    }
}

module.exports = User;
