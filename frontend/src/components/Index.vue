<template>
    <div class="align" id="Home">
      <md-button class="md-accent md-raised" id="logout" @click="logOut">로그아웃</md-button><br>
      <br>
      <md-chip class="md-accent" md-clickable>미세먼지: {{pm10Value}}</md-chip>
      <md-chip class="md-primary" md-clickable>초미세먼지: {{pm25Value}}</md-chip>
      <br>
      <br>
      <md-chip class="md-primary" md-clickable>하늘상태: {{sky}}</md-chip>
      <md-chip class="md-accent" md-clickable>강수확률: {{rain}}%</md-chip>
      <md-chip class="md-primary" md-clickable>현재온도: {{temp}}도</md-chip><br>

      <br>
      <span class="md-title">창문 수동 조정</span> <br> 
      <input @click="changeWindow" type="range" v-model.number="amount"> {{ amount }}%
      <br><br>
      
      <span class="md-title">창문 자동 조절 예약</span> <br>
      <vue-timepicker v-model="simpleStringValue"></vue-timepicker><input type="range" v-model.number="windowAmount"> {{ windowAmount }}%
      <md-button class="md-primary md-raised" @click="setAlarm">예약</md-button>


    </div>

</template>
<script>
import VueTimepicker from 'vue2-timepicker'
  export default{
    name: 'Home',
    data() {
      return {
        //windowStatus:true,
        amount:0,
        windowAmount:0,
        simpleStringValue:'',
        user:{},
        pm10Value:'',
        pm25Value:'',
        rain:'',
        sky:'',
        temp:'',
      }
    },
    components: {
        VueTimepicker,
        
        //VResume
    },
     created(){//시작하자마자 실행되는 함수들
        this.$http.get('http://localhost:8888/',{'headers': {authorization: `Bearer ${localStorage.token}`}}).then(res => {//우선 토큰의 유효성을 검사
              this.user={};
              this.user = res.data.user;
              this.getStatus(this.user);
        })
        this.$http.get('http://localhost:8888/weather/').then(res => {//처음에 웹페이지 로그인하자마자 초미세먼지와 미세먼지 정보 가져옴
              console.log(res.data.pm25Value);
              var mise = res.data.pm10Value;
              var chomise = res.data.pm25Value;
              if(mise>=0&&mise<31){
                this.pm10Value='좋음';
              }
              else if(mise>=31&&mise<81){
                this.pm10Value='보통';
              }
              else if(mise>=81&&mise<151){
                this.pm10Value='나쁨';//미세먼지 나쁨이면 창문 닫아줌
                this.mise();
              }
              else if(mise>=151){
                this.pm10Value='매우나쁨';//미세먼지 나쁨이면 창문 닫아줌
                this.mise();
              }


              if(chomise>=0&&chomise<16){
                this.pm25Value='좋음';
              }
              else if(chomise>=16&&chomise<36){
                this.pm25Value='보통';
              }
              else if(chomise>=36&&chomise<76){
                this.pm25Value='나쁨';//초미세먼지 나쁨이면 창문 닫아줌
                this.mise();
              }
              else if(chomise>=76){
                this.pm25Value='매우나쁨';//초미세먼지 나쁨이면 창문 닫아줌
                this.mise();
              }
        })
        this.$http.get('http://localhost:8888/weather/sky').then(res => {//로그인 하자마자 날씨정보 받아옴
              this.sky=res.data.sky;
              this.rain = res.data.pop;
              this.temp = res.data.t3h;
              if(res.data.pop == 100){//비가 오므로 창문을 닫아줌
                this.mise();
              }
        })
        console.log(this.user)
         
    },
    methods: {
      getStatus(data){//지금 window가 열려있는 상태를 DB에서 가저오는 함수
        this.$http.get('http://localhost:8888/win/get/status',{params:{userID:this.user.userID}}).then(res => {
          this.amount = res.data.winStatus;

              
        })
      },
      changeWindow(){//window 상태를 조절해주는 함수
        this.$http.get('http://localhost:8888/win/manual',{params:{value: this.amount}}).then((result) => {//창문을 수동으로 조절하는 함수
            //수동으로 설정한 창문의 정보를 보냄
        }).catch((err) => {
            
        });
        this.$http.post('http://localhost:8888/win/status',{value: this.amount,userID:this.user.userID}).then((result) => {//동시에 DB에 창문 상태를 저장함
            //수동으로 설정한 창문의 정보와, 사용자의 정보를 전달.
        }).catch((err) => {
            
        });
       
      },
      mise(){//100퍼센트로 창문 닫는 함수
        this.$http.get('http://localhost:8888/win/mise').then((result) => {
            
        }).catch((err) => {
            
        });
      },
      setAlarm(){//시간 예약 하는 함수 (SimpleStringValue라는 값은 에약한 시간임. 즉, 시간을 보내는 것임)
        this.$http.get('http://localhost:8888/win/alarm',{params:{value: this.simpleStringValue}}).then((result) => {
            
        }).catch((err) => {
            
        });
      },
      logOut(){
        localStorage.removeItem('token')//토큰을 localstorage에서 삭제함
        this.$router.push('login')//로그아웃 후 login 페이지로 이동
      }
    }
  }
</script>

<style scoped>
#logout{
  height: 20px;
}
.align{
  text-align: center;
}
.md-chips {
    margin-bottom: 24px;
  }

small {
  font-weight: 500;
}
</style>