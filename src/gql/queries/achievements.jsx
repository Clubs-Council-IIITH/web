import gpl from 'graphql-tag'

export const GET_ACHIEVEMENT_ID_FROM_CODE = gpl`
  query Query($code: String!) {
    achievementid(code: $code)
  }
`;

export const GET_ALL_ACHIEVEMENTS= gpl`
query AllAchievements {
  allAchievements {
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
      approvedBy
      approvedDatetime
      submissionDatetime
      lastUpdatedDatetime
      lastUpdatedBy
      deletionDatetime
      deletedBy
      rejectedDatetime
      rejectedBy
    }
  }
}
`
export const GET_ACHIEVEMENT_BY_USER = gpl`
query AchievementsByUser($uid: String!) {
  achievementsByUser(uid: $uid) {
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
      approvedBy
      approvedDatetime
      submissionDatetime
      lastUpdatedDatetime
      lastUpdatedBy
      deletionDatetime
      deletedBy
      rejectedDatetime
      rejectedBy
    }
  }
}`

export const GET_ACHIEVEMENT_BY_ID= gpl`
query AchievementById($achievementid: String!) {
  achievementById(achievementid: $achievementid) {
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
      approvedBy
      approvedDatetime
      submissionDatetime
      lastUpdatedDatetime
      lastUpdatedBy
      deletionDatetime
      deletedBy
      rejectedDatetime
      rejectedBy
    }
  }
}`
export const GET_ACHIEVEMENT_BY_CLUB = gpl`
query AchievementsByClub($cid: String!) {
  achievementsByClub(cid: $cid) {
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
      approvedBy
      approvedDatetime
      submissionDatetime
      lastUpdatedDatetime
      lastUpdatedBy
      deletionDatetime
      deletedBy
      rejectedDatetime
      rejectedBy
    }
  }
}`
