import gql from "graphql-tag";

export const GET_MEMBERS = gql`
  query Members($clubInput: SimpleClubInput!) {
    members(clubInput: $clubInput) {
      _id
      cid
      uid
      poc
      roles {
        name
        startYear
        endYear
        approved
        rejected
        deleted
      }
    }
  }
`;

export const GET_CURRENT_MEMBERS = gql`
  query CurrentMembers($clubInput: SimpleClubInput!) {
    currentMembers(clubInput: $clubInput) {
      _id
      cid
      uid
      poc
      roles {
        name
        startYear
        endYear
        approved
        rejected
        deleted
      }
    }
  }
`;

export const GET_PENDING_MEMBERS = gql`
  query PendingMembers {
    pendingMembers {
      _id
      cid
      uid
      poc
      roles {
        rid
        name
        startYear
        endYear
        approved
        rejected
        deleted
      }
    }
  }
`;

export const GET_MEMBER = gql`
  query Member($memberInput: SimpleMemberInput!, $userInput: UserInput!) {
    member(memberInput: $memberInput) {
      _id
      uid
      cid
      poc
      roles {
        startYear
        rid
        name
        endYear
        deleted
        approved
        rejected
      }
    }
    userProfile(userInput: $userInput) {
      firstName
      lastName
      gender
      email
    }
    userMeta(userInput: $userInput) {
      img
    }
  }
`;

export const GET_USER_CERTIFICATES = gql`
  query GetUserCertificates {
    getUserCertificates {
      _id
      certificateNumber
      status {
        requestedAt
      }
      state
    }
  }
`;

export const GET_PENDING_CERTIFICATES = gql`
  query GetPendingCertificates {
    getPendingCertificates {
      _id
      certificateNumber
      userId
      status {
        requestedAt
      }
      state
      requestReason
    }
  }
`;

export const VERIFY_CERTIFICATE = gql`
  query VerifyCertificate($certificateNumber: String!, $key: String!) {
    verifyCertificate(certificateNumber: $certificateNumber, key: $key) {
      _id
      certificateNumber
      userId
      state
      status {
        requestedAt
        ccApprovedAt
        ccApprover
        sloApprovedAt
        sloApprover
      }
      certificateData
      requestReason
    }
  }
`;

export const GET_MEMBERSHIPS = gql`
  query MemberRoles($uid: String!) {
    memberRoles(uid: $uid) {
      cid
      roles {
        startYear
        endYear
        name
        deleted
      }
    }
  }
`;

export const GET_CERTIFICATE_BY_NUMBER = gql`
  query GetCertificateByNumber($certificateNumber: String!) {
    getCertificateByNumber(certificateNumber: $certificateNumber) {
      _id
      certificateNumber
      userId
      state
      status {
        requestedAt
        ccApprovedAt
        ccApprover
        sloApprovedAt
        sloApprover
      }
      certificateData
      requestReason
    }
  }
`;

export const GET_ALL_CERTIFICATES = gql`
  query GetAllCertificates($page: Int!, $pageSize: Int!) {
    getAllCertificates(page: $page, pageSize: $pageSize) {
      certificates {
        _id
        certificateNumber
        userId
        state
        status {
          requestedAt
          ccApprovedAt
          sloApprovedAt
        }
      }
      totalCount
      totalPages
    }
  }
`;
