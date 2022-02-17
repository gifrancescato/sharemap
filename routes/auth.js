const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
// const passport = require('passport');


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
  
  router.get('/login', (req, res, next) => {
	res.render('login')
});

  router.post('/login', (req, res, next) => {
	const { username, password } = req.body
    console.log(req.body)

	User.findOne({ username: username })
		.then(userFromDB => {
			console.log('user: ', userFromDB)
			if (userFromDB === null) {
				// this user does not exist
				res.render('login', { message: 'Invalid credentials' })
				return
			}
		
			if (bcrypt.compareSync(password, userFromDB.password)) {
				console.log('authenticated')
				
				req.session.user = userFromDB
				console.log(req.session)
				res.render('profile')
			}
	// 	})
});
})

// router.get('/profile', (req, res) => res.render('profile'));


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