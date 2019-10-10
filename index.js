"use strict"

const express = require('express');
const app = express();
const textController = require('./controllers/textController');

app.set('view engine', 'ejs');
app.use(express.static('./public'));

textController(app);

app.listen(9000, () => console.log('You are listening to port 9000'));