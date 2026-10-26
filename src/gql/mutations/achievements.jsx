import gpl from "graphql-tag";

export const CREATE_ACHIEVEMENT = gpl`
mutation CreateAchievement($details: CreateAchievementDetails!) {
  createAchievement(details: $details) {
    _id
    name
    code
    clubids
    achievementType
    userids
    content
    blogLinks
    imageLinks
    dateperiod
    venue
    status {
      state
      submissionDatetime
    }
  }
}
`;
export const DELETE_ACHIEVEMENT = gpl`
mutation DeleteAchievement($achievementId: String!) {
  deleteAchievement(achievementId: $achievementId) {
    _id
    name
    code
    clubids
    achievementType
    userids
    content
    blogLinks
    imageLinks
    dateperiod
    venue
    status {
      state
      deletionDatetime
      deletedBy
      submissionDatetime
    }
  }
}
`;
export const EDIT_ACHIEVEMENT = gpl`
mutation EditAchievement($details: EditAchievementDetails!) {
  editAchievement(details: $details) {
    _id
    name
    code
    clubids
    achievementType
    userids
    content
    blogLinks
    imageLinks
    dateperiod
    venue
    status {
      lastUpdatedBy
      lastUpdatedDatetime
      state
      submissionDatetime
    }
  }
}
`;
export const APPROVE_ACHIEVEMENT = gpl`
mutation ApproveAchievement($achievementId: String!) {
  approveAchievement(achievementId: $achievementId) {
    _id
    name
    code
    clubids
    achievementType
    userids
    content
    blogLinks
    imageLinks
    dateperiod
    venue
    status {
      approvedBy
      approvedDatetime
      state
    }
  }
}
`;
export const REJECT_ACHIEVEMENT = gpl`
mutation RejectAchievement($achievementId: String!) {
  rejectAchievement(achievementId: $achievementId) {
    _id
    name
    code
    clubids
    achievementType
    userids
    content
    blogLinks
    imageLinks
    dateperiod
    venue
    status {
      rejectedDatetime
      rejectedBy
      state
      submissionDatetime
    }
  }
}
`;
