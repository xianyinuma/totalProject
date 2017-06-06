var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.nickname = user.nickname;
  this.email = user.email;
  this.record = 0;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  //要存入数据库的用户文档
  var user = {
      name: this.name,
      password: this.password,
      nickname: this.nickname,
      email: this.email,
      record: this.record
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//错误，返回 err 信息
        }
        callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

//更新用户邮箱
User.updateMail = function(username, newMail, callback) {
  console.log("Open");
  //打开数据库
  mongodb.open(function (err, db) {
    if(err) {
      return callback(err);
    }
    //读取 users 集合
      console.log("collection");

    db.collection('users', function(err, collection) {
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找用户名（name键）值为 name 一个文档

      collection.update({
        name: username
      }, {$set: { email : newMail }}, function(err, result) {
        collection.findOne({
        name: username
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, user);//成功！返回查询的用户信息
      });
      });
    });
  });
};

//更新用户昵称
User.updateNick = function(username, nickname, callback) {
  console.log("Open");
  //打开数据库
  mongodb.open(function (err, db) {
    if(err) {
      return callback(err);
    }
    //读取 users 集合
      console.log("collection");

    db.collection('users', function(err, collection) {
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找用户名（name键）值为 name 一个文档

      collection.update({
        name: username
      }, {$set: { nickname : nickname }}, function(err, result) {
        collection.findOne({
        name: username
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, user);//成功！返回查询的用户信息
      });
      });
    });
  });
};


//读取用户信息
User.get = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, user);//成功！返回查询的用户信息
      });
    });
  });
};