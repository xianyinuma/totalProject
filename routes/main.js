var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/',function(req, res, next){
  //res.send('WOW,This is the new ROUTER'+req.originalUrl);
  //res.sendFile(path.join(__dirname, '../public/templates', 'index.html'));
  res.render('welcome',{
    title:'UnchartedWaters',
    username: req.session.username
  })
});
router.get('/index',function(req,res,next){
  res.sendFile(path.join(__dirname, '../public/templates', 'index.html'));
});
router.get('/reg', function (req, res) {
    res.render('reg',{
        title:'注册',
        user:req.session.user,
        error: req.flash('error').toString(),
        success: req.flash('success').toString(),
    })
    
});
router.get('/log', function (req, res) {
    res.render('log', { 
      title: '登录',
      user:req.session.user,
      error: req.flash('error').toString(),
      success: req.flash('success').toString(),
    });
});
router.get('/webGL', function(req, res, next){
  // res.sendFile('three.html');
  res.sendFile(path.join(__dirname, '../public/templates', 'three.html'));
  //res.send('WOW,This is the new WEBGL!');
});

router.get('/process_get',function(req,res){
    response={
        username:req.query.username,
        password:req.query.password,
    }
    req.session.username=req.query.username;
    //res.send(JSON.stringify(response));
    //return res.redirect('/webGL?username='+req.query.username);
    res.send(req.session);
})

module.exports = router;
