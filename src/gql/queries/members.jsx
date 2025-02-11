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
        approvalTime
        rejected
        rejectionTime
      }
      creationTime
      lastEditedTime
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
      userId
      certificateNumber
      status {
        requestedAt
      }
      state
      certificateData
      requestReason
      key
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
      certificateData
      requestReason
      key
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
      key
    }
  }
`;

export const GET_ALL_CERTIFICATES = gql`
  query GetAllCertificates{
    getAllCertificates{
        _id
        certificateNumber
        userId
        state
        status {
          requestedAt
          ccApprovedAt
          sloApprovedAt
        }
        certificateData
        requestReason
        key
    }
  }
`;

export const DOWNLOAD_MEMBERS_DATA = gql`
  query DownloadMembersData($details: MemberInputDataReportDetails!) {
    downloadMembersData(details: $details) {
      csvFile
    }
  }
`;
