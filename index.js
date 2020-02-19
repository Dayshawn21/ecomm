const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const usersRepo = require('./repos/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession ({
  keys: ['fsdfsdklj3k2kj2332kj']
}))

app.get('/signup', (req, res) => {
	res.send(`
  <div>
    Your id is: ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password"placeholder="password" />
      <input  name="password1"placeholder="confirm password" />
      <button> Sign Up </button>
    </form>
  </div>
  `);
});

app.post('/signup', async (req, res) => {
	const { email, password, password1 } = req.body;

	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) {
		return res.send('Email is use');
	}

	if (password !== password1) {
		return res.send('Passwords must match');
	}

  const user = await usersRepo.create({ email, password });
  

  req.session.userId = user.id
	res.send('Accont created');
});

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are sign out')

})

app.get('/signin', (req, res) => {
  res.send(`
  <div>
  <form method="POST">
    <input name="email" placeholder="email" />
    <input name="password"placeholder="password" />
    <button> Sign In </button>
  </form>
</div>
  
  
  `)
})

app.post('/signin', async (req, res) => {
  const {email , password} = req.body;

  const user = await usersRepo.getOneBy({email});
  if(!user) {
    return res.send('Email not found')
  };

  if(user.password !== password ){
    return res.send('Invaid Password')
  };

  req.session.userId = user.id;

  res.send('Up are signed in !!!');

})
app.listen(3000, () => {
	console.log('listening');
});
