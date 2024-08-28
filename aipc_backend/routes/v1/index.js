const express = require('express');

const homeRoutes = require('./home');

const app = express();

// Use the routes for version 1
app.use('/home', homeRoutes);


module.exports = app;