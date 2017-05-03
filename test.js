var express=require("express");
var test=express();
var users=require('./routes/users');

test.use(express.static('public'));

test.get('/',function(req,res){
    res.send('Hello Test');
    res.send(req.query);
    res.send(req.baseUrl);

})
test.get('/index',function(req,res){
    res.sendFile(__dirname+'/'+"index.html");
})
test.use('/user',users);
test.get('/three',function(req,res){
    res.sendFile(__dirname+"/"+"three.html");
})
test.get('/process_get',function(req,res){
    response={
        first_name:req.query.first_name,
        last_name:req.query.last_name,
    }
    res.send(JSON.stringify(response));
})
test.listen(3000,function(){
    console.log('This is the test and listening on the port:',3000);
})