const express = require('express');
const path = require('path');

const app = express();

const indexRouter = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const port = process.env.PORT || 5000;
const server = app.listen(port, err => {
	console.log(`API listening on port ${port}.`);
	if (err) throw err;
});

module.exports = app;
