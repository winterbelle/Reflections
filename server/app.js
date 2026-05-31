require("dotenv").config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Route for posts
const postsRouter = require('./routes/posts');

// Chatbot route
const chatRouter = require('./routes/chat');

const dbTestRouter = require("./routes/dbTest");

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use("/db-test", dbTestRouter);

app.use('/posts', postsRouter);

// AI chatbot routes
app.use('/chat', chatRouter);

module.exports = app;
