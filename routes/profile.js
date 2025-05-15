const express = require('express');
const router = express.Router();

function ensureAuth(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}

router.get('/', ensureAuth, (req, res) => {
    res.render('profile', { user: req.session.user });
});

module.exports = router;