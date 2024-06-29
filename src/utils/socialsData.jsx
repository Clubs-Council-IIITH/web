export const socialsData = {
  website: { label: "Website", icon: "mdi:web", color: "#7F7F7F" },
  facebook: {
    label: "Facebook",
    icon: "ic:baseline-facebook",
    regex:
      "(?:(?:http|https)://)?(?:www.)?facebook.com/(?:(?:w)*#!/)?(?:pages/)?(?:[?w-]*/)?(?:profile.php?id=(?=d.*))?([w-]*)?",
    color: "#3C5999",
  },
  instagram: {
    label: "Instagram",
    icon: "mdi:instagram",
    validation: "instagram.com",
    color: "#E94475",
  },
  twitter: {
    label: "Twitter/X",
    icon: "ri:twitter-x-fill",
    // validation: "twitter.com",
    redex: "\b(?:twitter.com|x.com)\b",
    color: "#000",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "mdi:linkedin",
    regex: "http(s)?://([w]+.)?linkedin.com/(?:company/|in/)[A-z0-9_-]+/?",
    color: "#027FB1",
  },
  discord: {
    label: "Discord",
    icon: "ic:baseline-discord",
    regex:
      "^(https?://)?(www.)?((discord.(gg|io|me|li))|(discordapp.com/invite|discord.com/invite))/[A-z0-9_-]+$",
    color: "#5865F3",
  },
  youtube: {
    label: "YouTube",
    icon: "mdi:youtube",
    regex:
      "^(?:https?://)?(?:(?:www|gaming).)?youtube.com/(?:channel/|(?:user/)?)([a-z-_0-9]+)/?(?:[?#]?.*)$",
    color: "#FF3333",
  },
  whatsapp: {
    label: "WhatsApp Group/Community",
    icon: "mdi:whatsapp",
    regex: "^(https?://)?chat.whatsapp.com/(?:invite/)?([a-zA-Z0-9_-]{22})$",
    color: "#25D366",
  },
};
