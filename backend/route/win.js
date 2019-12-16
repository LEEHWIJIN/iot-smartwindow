const Router = require('express')
const router = Router()
const mysql = require('../db/database_config.js')
var conn = mysql()
var coap        = require('coap')
  , server      = coap.createServer()

server.on('request', function(req, res) {
  res.end('Hello ' + req.url.split('/')[1] + '\n')
})

router.post('/status', function(req,res){//창문의 status를 저장해주는 함수
  Promise.resolve()
        .then(first)
        .then(second)
        .catch(function (err) {
            console.log('Error', err)
            process.exit()
        })

    function first() {
        return new Promise(function (resolve,reject) {
            var sql1 ='select winStatus from window where user_winID = ?'
            var userID = req.body.userID
            conn.init().query(sql1,userID,function (err,rows) {
              if(err) console.log(err)
              else{
                resolve(rows[0])
              }
            })
        })
    }

    function second(data) {
        return new Promise(function (resolve,reject) {
          var sql2 = 'UPDATE window SET winStatus=? WHERE user_winID = ?'
          var winStatus = req.body.value;
          var user_winID = req.body.userID;
          var params2 = [winStatus, user_winID]
          conn.init().query(sql2, params2, function (err, rows) {
              if (err) console.log(err)
              else {
                  res.send(rows)
                  resolve()
              }
          })
        })
    }
})

router.get('/get/status', function(req,res){//창문의 상태를 가져와주는 함수
  var sql1 ='select winStatus from window where user_winID = ?'
  var userID = req.query.userID
  conn.init().query(sql1,userID,function (err,rows) {
    if(err) console.log(err)
    else{
      console.log(rows)
      res.send(rows[0])
    }
  })
})

router.get('/manual', function(req, res){//창문을 수동으로 조절해주는 함수
    var window = req.query.value //frontend에서 보낸 창문을 조절하는 값

    server.listen(function() {
        console.log(window);
        var req = coap.request('coap://192.168.137.221:5683')
      
        var requestOptions = {
          host: '192.168.137.221',
          port: 5683,
          pathname: 'advanced',
          method: 'PUT',
        };
        
        var req = coap.request(requestOptions);
        
        var payload = 'w '+window;
                
        req.write(JSON.stringify(payload));
      
        req.on('response', resp => {
          console.log('Got response:', resp.code, resp.payload.toString());
        });
        
        //req.end();
      
        req.end()
      })
})

router.get('/alarm', function(req, res){//예약한 창문을 조절해주는 함수
  var alarm = req.query.value;
  var windowAmount = req.query.windowAmount;
  var after = alarm.split(':')
  var change = Date(alarm)
  
  var today =  new Date()//예약한 시간과 현재 시간을 비교하여 빼줌
  today.setHours(after[0]-today.getHours())
  today.setMinutes(after[1]-today.getMinutes())
  var wantTIme = today.getHours()*3600+today.getMinutes()*60
  setTimeout(function(){//빼준 시간을 가지고 settimeout을 함
      server.listen(function() {
      var req = coap.request('coap://192.168.137.221:5683')
      
      var requestOptions = {
        host: '192.168.137.221',
        port: 5683,
        pathname: 'advanced',
        method: 'PUT',
      };
      
      var req = coap.request(requestOptions);
      
      var payload = 'w '+windowAmount;
              
      req.write(JSON.stringify(payload));
    
      req.on('response', resp => {
        console.log('Got response:', resp.code, resp.payload.toString());
      });
      
      req.end();
    
      req.end()
    })
  },wantTIme*50)
})

router.get('/mise', function(req, res){
    server.listen(function() {
    var status = "0";
    var req = coap.request('coap://192.168.137.221:5683')
    
    var requestOptions = {
      host: '192.168.137.221',
      port: 5683,
      pathname: 'advanced',
      method: 'PUT',
    };
    
    var req = coap.request(requestOptions);
    
    var payload = 'w '+status;
            
    req.write(JSON.stringify(payload));
  
    req.on('response', resp => {
      console.log('Got response:', resp.code, resp.payload.toString());
    });
    
    req.end();
  
    req.end()
  })
})

module.exports = router