import Vue from 'vue'
import Router from 'vue-router'
// import Survey from './components/Survey.vue'
import Home from './components/Index.vue'
import Blind from  './components/Blind.vue'
import Login from './components/Login.vue'
import SignUp from './components/SignUp.vue'

Vue.use(Router)

function loggedin(to, from, next) {
  // alert('로그인 하세요')
  // next('/login')
  if(!localStorage.token){
    alert('로그인 하세요')
    next('/login')
  }
  else{
    next();
  }
}
function login(to, from, next) {
  if(localStorage.token){
    next('/home')
  }
  else{
    next();
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'root',
      component: Home,
      //component: Resume,
      beforeEnter : loggedin,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      //beforeEnter: loggedin,
      //component: ()=> import('./components/Resume/Index'),
      // meta: {
      //   permission: -1,
      //   restrict: false,
      // }
    },
    {
      path : '/login',
      name : 'login',
      component : Login,
      //beforeEnter: login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      //beforeEnter: login
    },
    {
      path: '/blind',
      name: 'blind',
      component: Blind
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ Menu)
    }
  ]
})
