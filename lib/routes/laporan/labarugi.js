"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../common');

const harian = require('./labarugi/harian');
const bulanan = require('./labarugi/bulanan');

router.use('/harian', harian);
router.use('/bulanan', bulanan);

module.exports = router;
