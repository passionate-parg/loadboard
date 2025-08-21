function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  req.session.flash = { type: 'warning', message: 'Please sign in to continue' };
  res.redirect('/signin');
}
module.exports = { ensureAuth };
