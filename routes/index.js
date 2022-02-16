const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const loggedInUser = req.user;
  res.render("index",  { user: loggedInUser });
});

function loginCheck() {
  return (req, res, next) => {
    if (req.user) {
      next()
    } else {
      // if user is not logged in
      res.redirect('/login')
    }
  }
}

router.get("/profile", loginCheck(), (req, res, next) => {
  const user = req.user
  res.render("profile", { user: loggedInUser });
});

module.exports = router;
