import gql from "graphql-tag";

export const CREATE_MEMBER = gql`
  mutation CreateMember($memberInput: FullMemberInput!) {
    createMember(memberInput: $memberInput) {
      _id
    }
  }
`;

export const EDIT_MEMBER = gql`
  mutation EditMember($memberInput: FullMemberInput!) {
    editMember(memberInput: $memberInput) {
      _id
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($memberInput: SimpleMemberInput!) {
    deleteMember(memberInput: $memberInput) {
      _id
    }
  }
`;

export const APPROVE_MEMBER = gql`
  mutation ApproveMember($memberInput: SimpleMemberInput!) {
    approveMember(memberInput: $memberInput) {
      _id
    }
  }
`;

export const REJECT_MEMBER = gql`
  mutation RejectMember($memberInput: SimpleMemberInput!) {
    rejectMember(memberInput: $memberInput) {
      _id
    }
  }
`;

export const REQUEST_CERTIFICATE = gql`
  mutation RequestCertificate($certificateInput: CertificateInput!) {
    requestCertificate(certificateInput: $certificateInput) {
      _id
      certificateNumber
      status {
        requestedAt
        ccApprovedAt
        ccApprover
        sloApprovedAt
        sloApprover
      }
      state
      requestReason
    }
  }
`;

export const APPROVE_CERTIFICATE = gql`
  mutation ApproveCertificate($certificateNumber: String!) {
    approveCertificate(certificateNumber: $certificateNumber) {
      _id
      certificateNumber
      state
      status {
        ccApprovedAt
        ccApprover
        sloApprovedAt
        sloApprover
      }
    }
  }
`;

export const REJECT_CERTIFICATE = gql`
  mutation RejectCertificate($certificateNumber: String!) {
    rejectCertificate(certificateNumber: $certificateNumber) {
      _id
      certificateNumber
      state
    }
  }
`;
