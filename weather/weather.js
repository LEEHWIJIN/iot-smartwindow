setTimeout(function(){
    var request = require('request');
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var data_yyyy=yyyy, data_mm=mm, data_dd=dd, data_hours=hours;

    if(minutes < 10){
    // 10분보다 작으면 한시간 전 값
    data_hours = hours - 1;        
    }

    //3시간마다 예보
    if(hours>=2&&hours<5){data_hours=2}
    if(hours>=5&&hours<8){data_hours=5}
    if(hours>=8&&hours<11){data_hourss=8}
    if(hours>=11&&hours<14){data_hours=11}
    if(hours>=14&&hours<17){data_hours=14}
    if(hours>=17&&hours<20){data_hours=17}
    if(hours>=20&&hours<23){data_hours=20}

    if(hours < 2){
    // 자정 이전은 전날로 계산
    let want_today=today 
    want_today.setDate(want_today.getDate() - 1);
    data_dd = want_today.getDate();
    data_mm = want_today.getMonth()+1;
    data_yyyy = want_today.getFullYear();
    hours = 23;
    }  

    //한자리 수는 0포함시킴
    if(hours<10) {       
    hours='0'+hours
    }
    if(data_hours<10) {       
    data_hours='0'+data_hours
    }
    if(mm<10) {
    mm='0'+mm
    }
    if(data_mm<10) {
    data_mm='0'+data_mm
    }
    if(dd<10) {
    dd='0'+dd
    } 
    if(data_dd<10) {
    data_dd='0'+data_dd
    } 
    if(minutes<10) {
    minutes='0'+minutes
    } 
    if(seconds<10){
    seconds='0'+seconds
    } 
    
    var url =  "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst"
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + "YZ6YokZ7z9x3CClxy9BQq96KhjF1pJnENJwyCRLbKSYtA1KWyAX9QaULq%2FVLIa8QwtausIQz9vwq%2FWteHvwHzw%3D%3D"; /* Service Key*/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' +  encodeURIComponent("50"); /* 한 페이지 결과 수 */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent("1"); /* 페이지 번호 */
    queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent("경기"); /* 시도 이름 (서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종) */
    queryParams += '&' + encodeURIComponent('searchCondition') + '=' +  encodeURIComponent("DAILY"); /* 요청 데이터기간 (시간 : HOUR, 하루 : DAILY) */
    // queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3');
        request({
            url: url + queryParams + '&_returnType=json',
            method: 'GET'
        }, function (err, response, body) {
        var jsonData = JSON.parse(body);
        var arr = jsonData.list;
        var num;
        for(var i=0;i<arr.length;i++){
            if(arr[i].cityName=='수원시'){
                num=i
                break    
            }
        }
        var pm10Value = arr[num].pm10Value
        var pm25Value = arr[num].pm25Value;
        console.log("미세먼지 : " + pm10Value)
        console.log("초미세먼지 : " + pm25Value)
    })

        var _nx = 61,//수원시영통구
        _ny = 120,//원천동
        apikey = "YZ6YokZ7z9x3CClxy9BQq96KhjF1pJnENJwyCRLbKSYtA1KWyAX9QaULq%2FVLIa8QwtausIQz9vwq%2FWteHvwHzw%3D%3D",  
        basedate = String(yyyy)+String(data_mm)+String(data_dd), 
        basetime = String(data_hours)+'00',
        fileName = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData';
        fileName += '?' + encodeURIComponent("ServiceKey") + '=' + apikey;
        fileName += '&'+ encodeURIComponent("base_date") + '=' + encodeURIComponent(basedate);
        fileName += '&'+ encodeURIComponent("base_time") + '=' + encodeURIComponent(basetime);
        fileName += '&'+ encodeURIComponent("nx") + '=' + _nx 
        fileName += '&'+ encodeURIComponent("ny") + '=' + _ny
        fileName += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* 한 페이지 결과 수 */
        fileName += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */ 
        fileName += "&_type=json"      

        //api url 가져오기
        request({
            url: fileName,
            method: 'GET'
        }, function (error, response, body) {
            var jsonDate = JSON.parse(body);          
            var arr = jsonDate.response.body.items.item;
            var sky, // (하늘상태) : 맑음(1), 구름조금(2), 구름많음(3), 흐림(4)
            pty, //(강수형태)없음(0), 비(1), 비/눈(2), 눈(3)
            pop,//강수확률(%)
            pty,//강수형태
            t3h; //3시간단위 현재온도             
    
            for(let i=0;i<arr.length;i++){
                if(arr[i].category=='POP'){
                    pop=arr[i].fcstValue;
                }
                if(arr[i].category=='SKY'){
                    if(arr[i].fcstValue==1){sky = '맑음'}
                    if(arr[i].fcstValue==2){sky = '구름조금'}
                    if(arr[i].fcstValue==3){sky= '구름많음'}
                    if(arr[i].fcstValue==4){sky = '흐림'}
                }
                if(arr[i].category=='PTY'){
                    if(arr[i].fcstValue==0){pty= '없음'}
                    if(arr[i].fcstValue==1){pty= '비'}
                    if(arr[i].fcstValue==2){pty= '비/눈'}
                    if(arr[i].fcstValue==3){pty= '눈'}
                }
                if(arr[i].category=='T3H'){
                    t3h=arr[i].fcstValue;
                }
            }
            console.log('강수확률은 '+pop+'%')
            console.log('하늘상태는 '+sky)
            console.log('강수형태는 '+pty)
            console.log('현재 온도는 '+t3h+'도')  
        })
    },2000);