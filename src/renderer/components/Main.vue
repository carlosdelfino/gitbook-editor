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

  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'main',
    components: { Navbar, Sidebar, Editor },
    methods: {
      ...mapActions([
        'setPath'
      ]),
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    computed: {
      ...mapGetters({
        currentLibrary: 'getLibrary'
      })
    },
    watch: {
      currentLibrary () {
        console.log('change')
      }
    }
  }
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
main {
  display: flex;
  flex: 1;
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
</style>
