const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fs = require('node:fs');
const app = express();

// routers
const apiRouter = require('./routes/api');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Opening up access to 'public' dir
// through the index route (no route at all)
app.use(express.static(path.join(__dirname, 'public')));

// Connecting router
app.use('/api', apiRouter);

module.exports = app;
