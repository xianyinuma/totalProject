var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
      title: '主页' ,
      user:req.session.user,
      error: req.flash('error').toString(),
      success: req.flash('success').toString(),
    });
});

router.get('/reg', function (req, res) {
    res.render('reg',{
        title:'注册',
        user:req.session.user,
        error: req.flash('error').toString(),
        success: req.flash('success').toString(),
    })
    
});


router.post('/reg', function (req, res) {
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
  //检验用户两次输入的密码是否一致
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!'); 
    return res.redirect('/reg');//返回注册页
  }
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
  });
  //检查用户名是否已经存在 
  User.get(newUser.name, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返回注册页
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册成功后返回主页
    });
  });
});

router.get('/log', function (req, res) {
    res.render('log', { 
      title: '登录',
      user:req.session.user,
      error: req.flash('error').toString(),
      success: req.flash('success').toString(),
    });
});


router.post('/log', function (req, res) {
    var name = req.body.name;
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(name,function(err,user){
        if(!user){
          req.flash('error',"用户不存在");
          return res.redirect('/log');
        }
        if(user.password!=password){
          req.flash('error','密码错误');
          return res.redirect('/log');
        }
        req.session.user=user;
        req.flash('success','登陆成功');
        return res.redirect('/');
    })
});
  
router.get('/post', function (req, res) {
    res.render('index', { 
      title: '发表' ,
      user: req.session.user,
      error: req.flash('error').toString(),
      success: req.flash('success').toString(),
  });
});

router.post('/post', function (req, res) {

});

router.get('/info',function(req,res){
    res.render('info',{
      title:'个人信息',
      user: req.session.user,
      error: req.flash('error').toString(),
      success: req.flash('success').toString(),
    })
})
router.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});
// router.get('/logout', function (req, res) {
//     req.session.user=null;
//     req.flash('success',"登出成功!");
//     res.redirect('/');
// });


module.exports = router;
