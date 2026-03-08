import { createRouter, createWebHistory } from "vue-router"

// Import your page components
import Courses from "../pages/Courses.vue"
import Categories from "../pages/Categories.vue"
import SubCategories from "../pages/SubCategories.vue"

const routes = [
  { path: "/courses", component: Courses },
  { path: "/categories", component: Categories },
  { path: "/subcategories", component: SubCategories },
  { path: "/", redirect: "/courses" } // default route
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router