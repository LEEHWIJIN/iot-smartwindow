//토큰을 확인해주는 함수
const jwt = require('jsonwebtoken')
const { SECRET } = require('../constants');

function checktoken(req, res, next){
    const authheader = req.get('authorization');//request가 들어왔을때 header에 authorization 이라는 말이 있으면 이 checktoken 함수가 바로 실행됨
    if(authheader){
        const token = authheader.split(' ')[1];
        if(token){
            jwt.verify(token, SECRET, (err, user)=>{
                if(err){//토큰 만료시
                    //console.log(err);
                    res.send({result : 1});
                }
                req.user = user;
                next(); //유저 정보를 넘긴후 다음 callback 함수를 실행함
            })
        }
        else{
            next();
        }
    }
    else{
        next();
    }
}

module.exports = {
    checktoken,
};