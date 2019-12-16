<template>
  <div class="align" id="app">
    <div id="nav">
      <router-link to="/home">Window</router-link> |
      <router-link to="/blind">Blind</router-link>
    </div>
    
    <router-view></router-view>
    
  </div>
</template>

<script>
export default{
    name: 'app',
    method:{
      
    }

}
</script>

<style>
.align{
  text-align: center;
}
</style>
