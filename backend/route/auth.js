const Router = require('express')
const router = Router()
const mysql = require('../db/database_config.js')
const crypto = require('crypto');
var conn = mysql()
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../constants');

const signup = joi.object().keys({
    name:joi.string().regex(/^[a-zA-Z0-9가-힣]+$/).min(1).max(30).required(),
    id:joi.string().alphanum().min(4).max(30).required(),
    password:joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

router.post('/login',(req,res)=>{
    var sql1 = 'select userPW,userName,userID from user where userName = ?'
    var userName = req.body.user.id
    conn.init().query(sql1, userName, function(err,rows){
        if(err) console.log(err)
        else{
            if(rows.length == 1){
                console.log(rows)
                    bcrypt.compare(req.body.user.password,rows[0].userPW).then(function(result){
                        if(result){
                            const payload = {
                                userID : rows[0].userID,
                                userName: rows[0].userName,
                                userFloor: rows[0].userFloor,
                            };
                            jwt.sign(payload, SECRET,{
                                expiresIn: '1d'
                            },(err, token) => {
                                if(err){
                                    console.log(err)
                                    return res.status(404).json({error:'토큰만료'});
                                }
                                else{
                                    res.json({token})
                                }
                            });
                        }
                        else{
                            return res.status(404).json({error:'비번틀림'});
                        }
                    })
            }
            else{
                return res.status(404).json({error:'fail'});
            } 
        }
    })
})

router.get('/dupcheck',function(req,res){
    var id = req.query.id;
    var sql = 'select userID from user where userName = ?'
    var param = [id]
    conn.init().query(sql, param, function(err, rows){
        if(err) console.log(err)
        else {
            if(rows.length==0){//not duplicate
                return res.send({result:0})
            }
            else{
                return res.send({result:1})
            }
        }
    })
})


router.post('/signup',(req,res)=>{
    Promise.resolve()
        .then(first)
        .then(second)
        .then(third)
        .catch(function (err) {
            console.log('Error', err)
            process.exit()
        })
    function first() {
        return new Promise(function (resolve,reject) {
            const result = joi.validate(req.body.user, signup);//조건에 맞는지 검사 result 가 뱉는 에러메세지로 나중에 프론트에서 띄워줘야함
            if(result.error === null){
                var sql1 = 'select userName from user where userName = ?'
                var userName = req.body.user.id
                
                conn.init().query(sql1,userName,function(err,rows){
                    if(err) console.log(err)
                    else {
                        if(rows.length == 0){
                            bcrypt.hash(req.body.user.password, 12).then(hashed => {
                                var sql2 = 'insert into user (userName, userPW, userFloor) values(?,?,?) '
                                var userFloor = req.body.user.name
                                var userName = req.body.user.id
                                var userPW = hashed
                                var params = [userName, userPW, userFloor]
                                conn.init().query(sql2, params, function(err,rows){
                                    if(err) console.log(err)
                                    else {
                                        //res.send({result : 1})
                                        //console.log(userName)
                                        resolve(userName)
                                    }
                                })
                            })
                        }
                    }
                })
            }
            else
            {
                if(result.error.message == 'child "name" fails because ["name" length must be less than or equal to 30 characters long]')
                {
                    console.log('이름은 30자 이하여야합니다.')
                    res.send('이름은 30자 이하여야합니다.')
                }
                else if(result.error.message == 'child "name" fails because ["name" length must be at least 2 characters long]')
                {
                    console.log('이름은 한글자 이상이여야합니다.')
                    res.send('이름은 한글자 이상이여야합니다.')
                }
                else if(result.error.message == 'child "id" fails because ["id" length must be at least 4 characters long]')
                {
                    console.log('아이디는 최소 4글자 이상이여야합니다.')
                    res.send('아이디는 최소 4글자 이상이여야합니다.')
                }
                else if(result.error.message == 'child "id" fails because ["id" length must be less than or equal to 30 characters long]')
                {
                    console.log('아이디는 최대 30글자입니다.')
                    res.send('아이디는 최대 30글자입니다.')
                }
                else
                {
                    console.log(result.error.message)
                    res.json(result.error);//조건에 안맞을때
                }
            }
        })
    }
    function second(data) {
        return new Promise(function (resolve, reject) {
            console.log(data)
            var sql2 = 'SELECT userID from user where userName=?'
            var params2 = [data]
            
            conn.init().query(sql2, params2, function (err, rows) {
                if (err) console.log(err)
                else {
                    console.log(rows[0])
                    resolve(rows[0])
                }
            })
        })
    }
    function third(data) {
        return new Promise(function (resolve, reject) {
            var sql3 = 'insert into window (user_winID, winstatus) values(?,?) '
            //var sql3 = 'INSERT userID from user where userName=?'
            var params3 = [data.userID,0]
            conn.init().query(sql3, params3, function (err, rows) {
                if (err) console.log(err)
                else {
                    console.log(rows)
                    //res.send('0')
                    res.send({result : 1})
                }
            })
        })
    }
    

})

module.exports = router