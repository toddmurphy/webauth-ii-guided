const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'Monkey',
  secret: 'may the force be with you',
  cookie: {
    maxAge: 1000 * 30,
    secret: false, // 'true' in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false // required for 'GDPR' privacy laws
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
