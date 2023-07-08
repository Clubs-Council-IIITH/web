// format -> route: [roles with access]

const routes = {
  // "/": [],
  // "/authRedirect": [],

  // "/about": [],
  // "/events": [],
  // "/events/[id]": [],
  // "/clubs": [],
  // "/clubs/[id]": [],
  // "/calendar": [],
  // "/student-bodies": [],

  "/manage/members": ["cc"],
  "/manage/members/new": ["cc", "club"], // has to be higher to not conflict with :id
  "/manage/members/@mine": ["club"], // has to be higher to not conflict with :id
  "/manage/members/:id": ["cc", "club"],
  "/manage/members/:id/edit": ["cc", "club"],

  "/manage/events": ["cc"],
  "/manage/events/new": ["cc", "club"], // has to be higher to not conflict with :id
  "/manage/events/@mine": ["club"], // has to be higher to not conflict with :id
  "/manage/events/:id": ["cc", "club"],
  "/manage/events/:id/edit": ["cc", "club"],

  "/manage/clubs": ["cc"],
  "/manage/clubs/new": ["cc"], // has to be higher to not conflict with :id
  "/manage/clubs/@mine": ["club"], // has to be higher to not conflict with :id
  "/manage/clubs/@mine/edit": ["club"], // has to be higher to not conflict with :id
  "/manage/clubs/:id": ["cc"],
  "/manage/clubs/:id/edit": ["cc"],
};

export default routes;
