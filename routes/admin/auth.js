const express = require('express');
const usersRepo = require('../../repos/users');
const signupTem = require('../../views/admin/auth/signup');
const signinTem = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTem({ req }));
});

router.post('/signup', async (req, res) => {
	const { email, password, password1 } = req.body;

	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) {
		return res.send('Email is use');
	}

	if (password !== password1) {
		return res.send('Passwords must match');
	}

	const user = await usersRepo.create({ email, password });

	req.session.userId = user.id;
	res.send('Accont created');
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are sign out');
});

router.get('/signin', (req, res) => {
	res.send(signinTem());
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	const user = await usersRepo.getOneBy({ email });
	if (!user) {
		return res.send('Email not found');
	}

	const validPassword = await usersRepo.comparePassword(user.password, password);

	if (!validPassword) {
		return res.send('Invaid Password');
	}

	req.session.userId = user.id;

	res.send('You are signed in !!!');
});

module.exports = router;
