const express = require('express');

const homeRoute = require('./home');

const app = express();

// Use the routes for version 1
app.use('/', homeRoute);


module.exports = app;