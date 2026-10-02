import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/Dashboard.vue";
import WeddingEditor from "../pages/WeddingEditor.vue";
import Invitation from "../pages/Invitation.vue";

const routes = [
  {
    path: "/",
    redirect: "/w/rahul-ananya",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/dashboard/wedding/new",
    name: "NewWedding",
    component: WeddingEditor,
  },
  {
    path: "/dashboard/wedding/:id",
    name: "EditWedding",
    component: WeddingEditor,
    props: true,
  },
  {
    path: "/w/:slug",
    name: "Invitation",
    component: Invitation,
    props: true,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});
