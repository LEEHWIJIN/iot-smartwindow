<template>
    <div class="signup" style="  width: 380px;">
        <h1>Sign Up</h1>
        <form v-on:submit.prevent='signup'>
            <label style="font-size: 20px">층수 :</label><input type="text" name="signname" v-model="user.name">층<br>
            <label style="font-size: 20px">ID : </label><input type="text" name="signid" v-model="user.id">
            <input class="duplicate" type="button" v-on:click="dupcheck" value="중복확인"><br>
            <label style="font-size: 20px">Password: </label> <input type="password" name="signpassword" v-model="user.password">
            <input type="submit" value="Sign Up">
        </form>
    </div>    
</template>

<script>
export default {
    data() {
        return{
            user :{
                name:"",
                id:"",
                password:""
            },
            Isuniq: -1,//중복확인 안했을 때
        }
    },
    created(){
        
    },
    methods:{
        signup(){//회원가입하는 함수
            if(this.Isuniq==-1) alert("중복을 확인하지 않았습니다. 확인하세요")
            else if(this.Isuniq == 1) alert("중복입니다.")
            else if(this.Isuniq==0){
                this.$http.post('http://localhost:8888/auth/signup', {user: this.user}).then((response) => {
                    if(response.data.result == 1){
                        this.$router.push('/login');
                    }
                    //console.log(response) //response가 있으면 error 가 있는것.    
                },(error)=>{
                console.log('err')
                alert(error.response)    
                })
            }
        },
        dupcheck(){//중복체크하는 함수
            this.$http.get('http://localhost:8888/auth/dupcheck', {params:{id : this.user.id}}).then((res)=>{
            if(res.data.result == 0) {//중복아닐때
                alert("사용 가능한 아이디 입니다.")
                this.Isuniq = 0;
            }
            else{
                alert("중복입니다.")
                this.Isuniq = 1;
            }
        },(error)=>{
            console.log('err')
            alert(error.response.data.error)    
            })
        }
    }
}
</script>
<style>
    .signup{
        margin-left: 200px;
        margin-top: 200px;
    }
    .duplicate{
        padding-top: 5px;
        padding-bottom: 5px;
        border-radius: 50px;
        background: white;
        border: none;
        /*box-shadow: 0 8px 15px 0 rgba(18, 151, 147, .4);*/
        display: block;
        margin: 0 auto;
        /*margin-top: 12px;*/
        width: 25%;
        color: rgba(54, 54, 54, 0.51);
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 1.05px;
    }
</style>