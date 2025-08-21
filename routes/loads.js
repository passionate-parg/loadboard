const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const { ensureAuth } = require('../middleware/auth');
router.get('/', ensureAuth, async (req, res) => {
  const loads = await Load.find({ user: req.session.user.id }).sort({ createdAt: -1 }).lean();
  res.render('loads', { title: 'My Loads', loads });
});
router.get('/all', ensureAuth, async (req, res) => {
  const { q, truckType } = req.query;
  const filter = {};
  if (q) filter.$or = [{ pickupLocation: new RegExp(q, 'i') }, { dropoffLocation: new RegExp(q, 'i') }, { commodity: new RegExp(q, 'i') }];
  if (truckType) filter.truckType = truckType;
  const loads = await Load.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).lean();
  res.render('allLoads', { title: 'All Loads', loads, q: q || '', truckType: truckType || '' });
});
router.get('/new', ensureAuth, (req, res) => { res.render('loadForm', { title: 'Post New Load', isEdit: false, load: {} }); });
router.post('/', ensureAuth, async (req, res) => {
  try {
    const body = req.body;
    await Load.create({ ...body, user: req.session.user.id });
    req.session.flash = { type: 'success', message: 'Load posted successfully' };
    res.redirect('/loads');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'danger', message: 'Failed to create load' };
    res.redirect('/loads/new');
  }
});
router.get('/:id/edit', ensureAuth, async (req, res) => {
  const load = await Load.findOne({ _id: req.params.id, user: req.session.user.id }).lean();
  if (!load) { req.session.flash = { type: 'warning', message: 'Load not found' }; return res.redirect('/loads'); }
  res.render('loadForm', { title: 'Edit Load', isEdit: true, load });
});
router.put('/:id', ensureAuth, async (req, res) => {
  try { await Load.findOneAndUpdate({ _id: req.params.id, user: req.session.user.id }, req.body); req.session.flash = { type: 'success', message: 'Load updated' }; res.redirect('/loads'); } catch (err) { console.error(err); req.session.flash = { type: 'danger', message: 'Update failed' }; res.redirect(`/loads/${req.params.id}/edit`); }
});
router.delete('/:id', ensureAuth, async (req, res) => { await Load.findOneAndDelete({ _id: req.params.id, user: req.session.user.id }); req.session.flash = { type: 'success', message: 'Load deleted' }; res.redirect('/loads'); });
module.exports = router;
