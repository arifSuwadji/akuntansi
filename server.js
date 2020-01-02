"use strict";

const express = require('express');
const session = require('express-session');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const config = require('./lib/config.json');
const port = config.webui.listen_port;
const auth = require('./lib/sessionLog');
const common = require('./lib/common');

const master = require('./lib/routes/master');
const login = require('./lib/routes/login');
const transaksi = require('./lib/routes/transaksi');
const laporan = require('./lib/routes/laporan');
const posting = require('./lib/routes/posting');
const dashboard = require('./lib/routes/dashboard');

const dataMemberControl = require('./lib/controllers/daemon/member');
const dataDepositControl = require("./lib/controllers/daemon/deposit");
const dataSuplierControl = require('./lib/controllers/daemon/suplier');

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: config.template_no_cache
});

env.addFilter('format_currency', (value) => {
    if (typeof value !== 'number') {
        return value
    }
    const formatter = new Intl.NumberFormat('ID');
    return formatter.format(value);
});

app.use("/assets", express.static(path.join(__dirname, '/public/bower_components')));
app.use("/plugins", express.static(path.join(__dirname, '/public/plugins')));
app.use("/img", express.static(path.join(__dirname, '/public/images')));
app.use("/komodojs", express.static(path.join(__dirname, '/public/komodo')));
app.use("/sweetalert", express.static(path.join(__dirname, '/node_modules/sweetalert2')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

process.on('unhandledRejection', function(err) {
    common.log(err);
});

app.get('/', function(req, res, next){
  res.redirect('/dashboard');
});

app.use(function(req, res, next){
  common.log(req.method, req.originalUrl);
  next();
});

app.use(session({
  secret: config.webui.session_secret,
  resave: true,
  saveUninitialized:false,
  name: config.webui.session_name,
  cookie: { maxAge: 60000 * 30 }
}));

app.use('/master', auth.approve, master);
app.use('/transaksi', auth.approve, transaksi);
app.use('/laporan', auth.approve, laporan);
app.use('/dashboard', auth.approve, dashboard);
app.use('/posting', posting);
app.use('/login', login);

app.use(function (req, res, next) {
  res.status(404).json({
    status: 'Failed',
    message: 'Upps..'
  });
});
/*
//insert data member
setInterval(() => {
  dataMemberControl.index();
},60000);

//insert data deposit
setInterval(() => {
  dataDepositControl.index();
},60000);

//insert data supplier
setInterval(() => {
  dataSuplierControl.index();
},60000);

//insert mutasi & saldo suplier
setInterval(() => {
  let dt = new Date();
  let exec_time = moment(dt).format('HH:mm:ss');
  if(exec_time == config.daemon.exec_time){
    common.log(exec_time);
    dataSuplierControl.mutasi();
  }
}, 1000);

//buat jurnal dan bukubesar penjualan, serta mutasi suplier
setInterval(() => {
  let dt = new Date();
  let exec_time = moment(dt).format('HH:mm:ss');
  if(exec_time == config.daemon.mutation_exec_time){
    dataSuplierControl.jurnalMutasi();
  }
}, 1000);
*/
app.listen(port, () => common.log(`Komodo Akuntansi listening on port ${port}!`));
