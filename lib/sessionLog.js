'use strict'

let authApprove = function(req, res, next){
  if(!req.session.users){
    res.redirect('/login');
  }else{
    next();
  }
};

exports.approve = authApprove;
