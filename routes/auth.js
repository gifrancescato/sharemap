const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');


router.get('/signup', (req, res, next) => {
    res.render('signup');
  });
  
  router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    // leght of the password
  
    if (password.length < 8) {
      res.render('signup', {
        message: 'Your password must have at least 8 characters',
      });
      return;
    }
  
    if (username.length === 0) {
      res.render('signup', { message: 'Necessary username' });
      return;
    }
  	
    // do we already have a user with that username in the db?

    User.findOne({ username : username }).then((userFromDB) => {
      if (userFromDB !== null) {
        res.render('signup', { message: 'Exsisting username' });
        return;
      } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
  		
        // create the user

        User.create({ username : username, password : hash })
          .then((createdUser) => {
            res.redirect('/login');
          })
          .catch((err) => {
            next(err);
          });
      }
    });
  });
  
  router.post('/login', (req, res, next) => {
	const { username, password } = req.body

	// do we have a user with that username
	User.findOne({ username: username })
		.then(userFromDB => {
			console.log('user: ', userFromDB)
			if (userFromDB === null) {
				// this user does not exist
				res.render('login', { message: 'Invalid credentials' })
				return
			}
			// username is correct 
			// we check the password against the hash in the database
			if (bcrypt.compareSync(password, userFromDB.password)) {
				console.log('authenticated')
				// it matches -> credentials are correct
				// we log the user in
				// req.session.<some key (normally user)>
				req.session.user = userFromDB
				console.log(req.session)
				// redirect to the profile page
				res.redirect('/profile')
			}
		})
});

router.get('/profile', (req, res) => res.render('profile'));


router.get('/logout', (req, res, next) => {
	// to log the user out we destroy the session
	req.session.destroy()
	res.render('index')
});



module.exports = router;


//   router.get('/login', (req, res, next) => {
//     res.render('login');
//   });
  
//   router.post(
//     '/login',
//     // res.render('profile'),
//     passport.authenticate('local', {
//       successRedirect: '/profile',
//       failureRedirect: 'login',
//       passReqToCallback: true,
//     })
//   );
  
  
//   //logout
//   router.get('/logout', (req, res, next) => {
//     req.logout();
//     req.session.destroy();
//     res.redirect('/');
//   })
  
//   module.exports = router;