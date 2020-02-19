const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouther = require('./routes/admin/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys : [
			'fsdfsdklj3k2kj2332kj'
		]
	})
);

app.use(authRouther);

app.listen(3000, () => {
	console.log('listening');
});
