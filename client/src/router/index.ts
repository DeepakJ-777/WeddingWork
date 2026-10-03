import { createRouter, createWebHistory } from "vue-router";
import BetrothalInviteView from "../views/BetrothalInviteView.vue";
import Dashboard from "../pages/Dashboard.vue";
import WeddingEditor from "../pages/WeddingEditor.vue";

const routes = [
  {
    path: "/",
    redirect: "/invite/divya-john-betrothal",
  },
  {
    path: "/invite/divya-john-betrothal",
    name: "BetrothalInvite",
    component: BetrothalInviteView,
  },
  {
    path: "/invite/:slug",
    name: "InviteSlug",
    component: BetrothalInviteView,
  },
  {
    path: "/w/:slug",
    name: "LegacyInviteSlug",
    component: BetrothalInviteView,
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
