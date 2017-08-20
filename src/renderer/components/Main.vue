<template>
  <div class="container">
    <Navbar></Navbar>
    <main>
      <div class="left-side">
        <Sidebar></Sidebar>
      </div>
      <div class="right-side">
        <Editor></Editor>
      </div>
    </main>
  </div>
</template>

<script>
  import Navbar from './Layout/Navbar'
  import Sidebar from './Layout/Sidebar'
  import Editor from './Layout/Editor'

  export default {
    name: 'main',
    components: { Navbar, Sidebar, Editor },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
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
  }
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  main {
    flex: 1;
    overflow: hidden;
    height: 100%;
    display: flex;
  }
  .left-side {
    width: 20vw;
    height: 100%;
    border-right: 1px solid #ddd;
  }
  .right-side {
    flex: 1;
    position: relative;
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


</style>
