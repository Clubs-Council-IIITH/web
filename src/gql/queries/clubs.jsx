import gql from "graphql-tag";

export const GET_ACTIVE_CLUBS = gql`
  query ActiveClubs {
    activeClubs {
      _id
      cid
      state
      category
      studentBody
      banner
      logo
      name
      tagline
    }
  }
`;

export const GET_ALL_CLUBS = gql`
  query AllClubs {
    allClubs {
      _id
      cid
      code
      state
      category
      studentBody
      logo
      name
      email
      tagline
    }
  }
`;

export const GET_ALL_CLUB_IDS = gql`
  query AllClubs {
    allClubs {
      _id
      cid
      name
    }
  }
`;

export const GET_CLUB = gql`
  query Club($clubInput: SimpleClubInput!) {
    club(clubInput: $clubInput) {
      _id
      cid
      code
      banner
      category
      studentBody
      description
      email
      logo
      name
      socials {
        website
        instagram
        facebook
        youtube
        twitter
        linkedin
        discord
        otherLinks
      }
      state
      tagline
    }
  }
`;

export const GET_MEMBERSHIPS = gql`
  query MemberRoles($uid: String!) {
    memberRoles(uid: $uid) {
      _id
      cid
      poc
      roles {
        startYear
        deleted
        name
        rid
        endYear
      }
    }
  }
`;
