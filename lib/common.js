'use strict';

const date = require('date-and-time');

let now = new Date();
let log = function(dataLog, dataLog2){
  now = new Date();
  console.log('[',date.format(now, 'YYYY-MM-DD HH:mm:ss'),']', '[Info]', dataLog, dataLog2 ? dataLog2 : '');
}

exports.now = function () {
  // body...
  let now = new Date();
  return date.format(now, 'YYYY-MM-DD HH:mm:ss');
};

exports.date = function () {
  // body...
  let now = new Date();
  return date.format(now, 'YYYY-MM-DD');
};

exports.pad_with_zeroes = function(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

exports.log = log;
