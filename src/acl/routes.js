// format -> route: [roles with access]

const routes = {
  // "/": [],

  // "/about": [],
  // "/events": [],
  // "/events/[id]": [],
  // "/clubs": [],
  // "/clubs/[id]": [],
  // "/calendar": [],
  // "/student-bodies": [],

  "/cc-recruitments": ["public"],
  "/cc-recruitments/all": ["cc"],
  "/cc-recruitments/all/:id": ["cc"],

  "/manage/members": ["cc", "club"],
  "/manage/members/new": ["cc", "club"], // has to be higher to not conflict with :id
  "/manage/members/:id": ["cc", "club"],
  "/manage/members/:id/edit": ["cc", "club"],

  "/manage/events": ["cc", "club", "slc", "slo"],
  "/manage/events/new": ["cc", "club"], // has to be higher to not conflict with :id
  "/manage/events/:id": ["cc", "club", "slc", "slo"],
  "/manage/events/:id/edit": ["cc", "club", "slo"],
  "/manage/data-events": ["cc", "club", "slc", "slo"],

  "/manage/clubs": ["cc"],
  "/manage/clubs/new": ["cc"], // has to be higher to not conflict with :id
  "/manage/clubs/~mine": ["club"], // has to be higher to not conflict with :id
  "/manage/clubs/~mine/edit": ["club"], // has to be higher to not conflict with :id
  "/manage/clubs/:id": ["cc"],
  "/manage/clubs/:id/edit": ["cc"],
};

export default routes;
