// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const cardRoutes = require('./routes/cards');
const imageRoutes = require('./routes/images');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mount routes
app.use('/api/cards', cardRoutes);
app.use('/api/images', imageRoutes);

module.exports = app;
