"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../common');
const config = require('../../config');

const pembelianControl = require('../../controllers/laporan/pembelian');

router.get('/data', pembelianControl.index);
router.get('/dataJson', pembelianControl.dataPembelian);
router.get('/detailJurnal/:idJurnal', pembelianControl.detailJurnal);
router.get('/detailJurnalJson/:idJurnal', pembelianControl.detailJurnalJson);

module.exports = router;
