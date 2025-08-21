const mongoose = require('mongoose');
const LoadSchema = new mongoose.Schema({
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  commodity: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  truckType: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Load', LoadSchema);
