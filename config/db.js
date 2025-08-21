const mongoose = require('mongoose');
module.exports = async function(uri) {
  try {
    if (!uri) {
      console.warn('⚠️  MONGO_URI not set; using default localhost');
      uri = 'mongodb://127.0.0.1:27017/loadboard';
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};
