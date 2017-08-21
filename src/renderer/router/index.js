import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/main',
      name: 'main',
      component: require('@/components/Main')
    },
    {
      path: '/',
      name: 'index',
      component: require('@/components/Index')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
