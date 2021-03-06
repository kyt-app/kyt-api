const express = require('express');
const path = require('path');
const cors = require("cors");
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
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const verifyRouter = require('./routes/verify')
const profileRouter = require('./routes/profile')
const qrcodeRouter = require('./routes/qrcode')
const testsRouter = require('./routes/tests')
const updateRouter = require('./routes/update')

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/verify', verifyRouter);
app.use('/profile', profileRouter);
app.use('/qrcode', qrcodeRouter);
app.use('/tests', testsRouter);
app.use('/update', updateRouter);

const port = process.env.PORT || 5000;

app.listen(port, err => {
	console.log(`API listening on port ${port}.`);
	if (err) throw err;
});
	
