
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const socketEvents = require('./utils/socket');
const { Model } = require("objection");
const knex = require('./database/knex');
const userRouter = require('./routes');

class Server {
    constructor() {
        this.port = process.env.APP_PORT || 3000;
        this.host = process.env.APP_HOST || `localhost`;
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
        Model.knex(knex);
        this.app.use(userRouter);
    }

    appRun() {
        new socketEvents(this.socket).socketConfig();
        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }
}

const app = new Server();

app.appRun();