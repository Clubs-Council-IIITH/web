export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/manage/",  "/*.json", "/*_middlewareManifest.js", "/*_ssgManifest.js", "/*.js"],
    },
  };
}
