const express = require('express');
const { isEmpty } = require('lodash');
const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
   
    return res.json({
       App: 'APN107-WalkieTalkie-Redesign Socket service'
    });
});

usersRouter.get('/jitsimeet/generateToken', async (req, res) => {
    const jwt = require('jsonwebtoken');

    // Replace these values with your own
    const appId = 'apn107-jitsimeet';
    const appSecret = '17539aeffc612444ed2e368b53a1e672dc3969c5478f9e709880f84e1e7a9d2b';
    const domain = 'https://apn107-jitsimeet.apnapps.com';
    const user = {
        id: '1', // Unique identifier for the user
        name: 'shawkivai',
        email: 'mustakim@appnap.io'
    };
    const room = '*'; // Or specify a room name
    const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 1 hour expiration

    // Create the payload
    const payload = {
        context: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        },
        aud: appId,
        iss: appId,
        sub: domain,
        room: room,
        exp: expirationTime
    };

    // Sign the token
    const token = jwt.sign(payload, appSecret);

    return res.send(token);
});

module.exports = usersRouter;