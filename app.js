const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config()

const app = express();

const mongoURI = process.env.DB_URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CosmosDB connected.")
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

app.use('/', indexRouter);
app.use('/users', usersRouter);

const port = process.env.PORT || 5000;

app.listen(port, err => {
	console.log(`API listening on port ${port}.`);
	if (err) throw err;
});
	
