const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const dashboardRouter = require('./app/dashboard/router');
const categoryRouter = require('./app/category/router');
const nominalRouter = require('./app/nominal/router')
const voucherRouter = require('./app/voucher/router')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'pvpstore',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.use(flash())
app.use(methodOverride('_method'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adminlte', express.static(path.join(__dirname, 'node_modules/admin-lte/')));

app.use('/', dashboardRouter);
app.use('/category', categoryRouter);
app.use('/nominal', nominalRouter)
app.use('/vouchers', voucherRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;