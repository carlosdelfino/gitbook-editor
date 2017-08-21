<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    height: 100%;
  }

  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 14px;
    height: 100%;
    -webkit-font-smoothing: antialiased;
  }
  #app {
    height: 100%;
    /*padding-top: 25px;*/
  }
  .container {
    height: 100%;
  }
  main {
    overflow: hidden;
    height: 100%;
  }
  button[class^=btn] {
    border: none;
    border-radius: 3px;
    min-width: 100px;
    padding: 10px;
    outline: none;
    cursor: pointer;
    font-size: 14px;
  }
  .btn-primary {
    border: 1px solid #00C28B;
    background-color: #00C28B;
    color: #fff;
  }
  .btn-secondary {
    color: rgba(0,0,0,.85);
    background-color: #eee;
    border: 1px solid #d3d3d3;
    color: #333;
  }

  ul {
    list-style: none;
  }

  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,.1);
  }

  *::-webkit-scrollbar-track {
    background: rgba(0,0,0,.05);
  }

  .sortable-blank-space {
    visibility: hidden;
  }

  input {
    height: 36px;
    border: 1px solid rgba(0,0,0,.14);
    border-radius: 2px;
    height: 36px;
    outline: none;
    width: 100%;
    padding: 0 12px;
    font-size: 14px;
    margin-bottom: 10px;
  }
</style>
