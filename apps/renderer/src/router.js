export const routes = [
  {
    path: "/",
    name: "landing",
    component: () => import("./views/LandingView.vue"),
  },
  {
    path: "/partner",
    name: "partner",
    component: () => import("./views/PartnerView.vue"),
  },
  {
    path: "/friends-family",
    name: "friends-family",
    component: () => import("./views/FriendsFamilyView.vue"),
  },
  {
    path: "/p/:slug",
    name: "page",
    component: () => import("./views/SlugView.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("./views/NotFoundView.vue"),
  },
];

// Per-route document title (the SPA has one static <title> in index.html).
const TITLES = {
  landing: "dónde está juanjo",
  partner: "Dónde está Juanjo",
  "friends-family": "Ubicación de JJ",
};

export function applyTitle(routeName) {
  document.title = TITLES[routeName] ?? "dónde está juanjo";
}
