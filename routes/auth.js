const express = require('express');
const User = require('../models/User');
const router = express.Router();
router.get('/signup', (req, res) => { if (req.session.user) return res.redirect('/loads'); res.render('signup', { title: 'Sign Up' }); });
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) { req.session.flash = { type: 'danger', message: 'Email already registered' }; return res.redirect('/signup'); }
    const user = new User({ name, email, password });
    await user.save();
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    req.session.flash = { type: 'success', message: 'Welcome! Your account was created.' };
    res.redirect('/loads');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'danger', message: 'Signup failed' };
    res.redirect('/signup');
  }
});
router.get('/signin', (req, res) => { if (req.session.user) return res.redirect('/loads'); res.render('signin', { title: 'Sign In' }); });
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      req.session.flash = { type: 'danger', message: 'Invalid credentials' };
      return res.redirect('/signin');
    }
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    req.session.flash = { type: 'success', message: 'Signed in successfully' };
    res.redirect('/loads');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'danger', message: 'Sign in error' };
    res.redirect('/signin');
  }
});
router.get('/signout', (req, res) => { req.session.destroy(() => res.redirect('/')); });
module.exports = router;
