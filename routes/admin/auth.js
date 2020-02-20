const express = require('express');
const {check, validationResult} = require('express-validator')
const usersRepo = require('../../repos/users');
const signupTem = require('../../views/admin/auth/signup');
const signinTem = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTem({ req }));
});

router.post('/signup',[
check('email').trim().normalizeEmail().isEmail().withMessage('Must Be a valid Email').custom(async(email) =>{
	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) {
		throw new Error("Email in use")
	}
}),
check('password').trim().isLength({ min:4, max:20}).withMessage('Must be between 4 and 20 Characters'),
check('password1').trim().isLength({ min:4, max:20}).withMessage('Must be between 4 and 20 Characters ').custom((password1, {req})=>{
	if (password1 !== req.body.password) {
		throw new Error("Password Must Match")
	}
})

],
 async (req, res) => {
	 const error = validationResult(req)
	 console.log(error)
	const { email, password, password1 } = req.body;



	

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
