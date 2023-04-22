// format -> route: [roles with access]
// [] -> no restrictions; anyone can access

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

    "/manage/members": ["cc", "club"],
    "/manage/members/new": ["cc", "club"],
    "/manage/members/:id": ["cc", "club"],
    "/manage/members/:id/edit": ["cc", "club"],

    "/manage/events": ["cc", "club"],
    "/manage/events/new": ["cc", "club"],
    "/manage/events/:id": ["cc", "club"],
    "/manage/events/:id/edit": ["cc", "club"],

    "/manage/clubs": ["cc"],
    "/manage/clubs/new": ["cc"],
    "/manage/clubs/:id": ["cc", "club"],
    "/manage/clubs/:id/edit": ["cc", "club"],
};

export default routes;
