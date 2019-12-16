<template>
    <div id="Home">
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
      <br>
      <span class="md-title">블라인드 수동 조정</span> <br> 
      <input @click="changeBlind" type="range" v-model.number="amount"> {{ amount }}%
      <br><br>
      
      <span class="md-title">블라인드 자동 조절 예약</span> <br>
      <vue-timepicker v-model="simpleStringValue"></vue-timepicker><input type="range" v-model.number="alarmAmount"> {{ alarmAmount }}%
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
        alarmAmount:0,
        simpleStringValue:'',
        pm10Value:'',
        pm25Value:'',
        sky:'',
        rain:'',
        temp:'',
      }
    },
    components: {
        VueTimepicker,
        
        //VResume
    },
     created(){
        this.$http.get('http://localhost:8888/',{'headers': {authorization: `Bearer ${localStorage.token}`}}).then(res => {//창문과 마찬가지로 토큰의 유효성을 체크하며 세션을 유지
              this.user={};
              this.user = res.data.user;
              this.getStatus(this.user);
        })
        this.$http.get('http://localhost:8888/weather/').then(res => {//창문과 마찬가지로 미세먼지와 초미세먼지의 정보를 받아옴
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
                this.pm10Value='나쁨';
              }
              else if(mise>=151){
                this.pm10Value='매우나쁨';
              }


              if(chomise>=0&&chomise<16){
                this.pm25Value='좋음';
              }
              else if(chomise>=16&&chomise<36){
                this.pm25Value='보통';
              }
              else if(chomise>=36&&chomise<76){
                this.pm25Value='나쁨';
              }
              else if(chomise>=76){
                this.pm25Value='매우나쁨';
              }
        })
        this.$http.get('http://localhost:8888/weather/sky').then(res => {//날씨정보 받아옴
              console.log(res)
              this.sky=res.data.sky;
              this.rain = res.data.pop;
              this.temp = res.data.t3h;
        })
    },
    methods: {
       getStatus(data){//블라인드의 상태를 가지고오는 함수
        this.$http.get('http://localhost:8888/blind/get/status',{params:{userID:this.user.userID}}).then(res => {
          this.amount = res.data.bilStatus;
              
        })
      },
      changeBlind(){
        this.$http.get('http://localhost:8888/blind/manual',{params:{value: this.amount}}).then((result) => {//블라인드를 수동으로 조절하는 함수
            //수동으로 설정한 블라인드의 정보를 보냄
        }).catch((err) => {
            
        });
        this.$http.post('http://localhost:8888/blind/status',{value: this.amount,userID:this.user.userID}).then((result) => {//동시에 DB에 블라인드 상태를 저장함
            //수동으로 설정한 블라인드의 정보와, 사용자의 정보를 전달.
        }).catch((err) => {
            
        });
      },
      
      setAlarm(){//blind의 알람을 설정하는 함수
        this.$http.get('http://localhost:8888/blind/alarm',{params:{value: this.simpleStringValue,alarmAmount:this.alarmAmount}}).then((result) => {
            
        }).catch((err) => {
            
        });
      },
      logOut(){//로그아웃 하는 함수
        localStorage.removeItem('token')//localStorage에서 토큰을 삭제
        this.$router.push('login')//로그인 하는 화면으로 옮김
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
</style>