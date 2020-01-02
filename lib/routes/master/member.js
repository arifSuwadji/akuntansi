"use strict";

const express = require("express");
const router = express.Router();

const common = require("../../common");

const memberControl = require("../../controllers/master/member");

router.get('/', function(req, res, next){
  res.redirect('/master/member/list');
})

router.get('/list', memberControl.index);
router.get('/listJson', memberControl.data);
router.get('/mutasi_hutang/:memberID/:nama', memberControl.mutasiHutang);
router.get('/mutasi_hutangJson/:memberID', memberControl.mutasiHutangJson);

module.exports = router;
