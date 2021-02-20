import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Home from '../components/home.vue'
import welcome from '../components/index/Analysis.vue'
import user from '../components/user/user.vue'
import rights from '../components/rights/rights.vue'
import roles from '../components/rights/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/params.vue'
import list from '../components/goods/list.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report.vue'
// 课程
import course from '../components/course/course.vue'
// 消息通知
import notify from '../components/notify/notify.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: user
      },
      {
        path: '/course',
        component: course
      },
      {
        path: '/message',
        component: notify
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/categories',
        component: cate
      },

      {
        path: '/params',
        component: params
      },
      {
        path: '/goods',
        component: list
      },
      {
        path: '/goods/add',
        component: add
      },
      {
        path: '/orders',
        component: order
      },
      {
        path: '/reports',
        component: report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 到哪里去，from从哪里来，next放行
  if (to.path === '/login' || to.path === '/register') {
    return next()
  } else {
    if (!window.sessionStorage.getItem('token')) {
      return next('/login')
    }
    next()
  }
})

export default router
