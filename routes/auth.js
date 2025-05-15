const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const router = express.Router();

// GET Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('login', { error: 'Invalid credentials' });
        }
        req.session.user = { id: user.id, username: user.username };
        res.redirect('/profile');
    });
});

// GET Signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// POST Signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
        if (err) {
            return res.render('signup', { error: 'Username taken or error occurred' });
        }
        req.session.user = { id: this.lastID, username };
        res.redirect('/profile');
    });
});

// GET Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
