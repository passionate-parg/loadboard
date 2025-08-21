require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

const app = express();
connectDB(process.env.MONGO_URI);

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI  }), 
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// flash helper
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/loads', require('./routes/loads'));

// 404
app.use((req, res) => res.status(404).render('404', { title: 'Not found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
