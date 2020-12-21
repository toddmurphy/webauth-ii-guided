const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session'); // install
const KnexSessionStore = require('connect-session-knex')(session);

const dbConnection = require('../database/dbConfig');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'cookieMonster',
  secret: process.env.SESSION_SECRET || 'may the force be with you', //used for cookie encryption
  cookie: {
    maxAge: 1000 * 60 * 10, //10 minute cookie in ms
    secure: false, // 'true' in production, only send cookies over HTTPS
    httpOnly: true // JS cannot access the cookies on the browser
  },
  resave: false,
  saveUninitialized: false, // required for 'GDPR' compliance privacy laws
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    createtable: 'true',
    clearInterval: 60000
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)); //turn on sessions

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
