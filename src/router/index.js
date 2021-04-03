import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
// 注册
import Register from '../components/Register.vue'
// 忘记密码
import alert from '../components/alertPwd.vue'
import Home from '../components/home.vue'
import welcome from '../components/index/Analysis.vue'
// 用户管理
import user from '../components/user/user.vue'
import myInfo from '../components/user/myInfo.vue'
import teachermsg from '../components/user/teachermsg.vue'
// 课程
import course from '../components/course/course.vue'
import teacher from '../components/course/teacher.vue'
import myTeather from '../components/course/myTeacher.vue'
import myStudent from '../components/course/myStudent.vue'

// 消息通知
import notify from '../components/notify/notify.vue'
// 意见管理
import mySuggest from '../components/suggest/mySuggest.vue'
import suggest from '../components/suggest/suggest.vue'
// 场地管理
import place from '../components/place/place.vue'
import root from '../components/root/root.vue'

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
    path: '/alertPssWord',
    name: 'alertPssWord',
    component: alert
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
        path: '/myStudent',
        component: myStudent
      },
      {
        path: '/root',
        component: root
      },
      {
        path: '/courseList',
        component: teacher
      },
      {
        path: '/teacherInfo',
        component: teachermsg
      },
      {
        path: '/myTeather',
        component: myTeather
      },
      {
        path: '/place',
        component: place
      },
      {
        path: '/message',
        component: notify
      },
      {
        path: '/suggest',
        component: suggest
      },
      {
        path: '/mySuggest',
        component: mySuggest
      },
      {
        path: '/myInfo',
        component: myInfo
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
  if (to.path === '/login' || to.path === '/register' || to.path === '/alertPssWord') {
    return next()
  } else {
    if (!window.sessionStorage.getItem('token')) {
      return next('/login')
    }
    next()
  }
})

export default router
