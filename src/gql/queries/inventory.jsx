import gql from "graphql-tag";

export const GET_ALL_ITEMS = gql`
  query GetItems($clubid: String, $limit: Int) {
    getItems(clubid: $clubid, limit: $limit) {
      _id
      iid
      name
      brand
      clubid
      netQty
      availableQty
      totalQty
      currentLocation
    }
  }
`;

export const GET_PENDING_ITEMS = gql`
  query PendingInventoryItems($clubid: String) {
    getItems(clubid: $clubid) {
      _id
      iid
      name
      brand
      clubid
      netQty
      availableQty
      totalQty
    }
  }
`;

export const GET_FULL_ITEM = gql`
  query GetItem($iid: String!) {
    getItem(iid: $iid) {
      _id
      iid
      name
      brand
      photo
      clubid
      netQty
      availableQty
      totalQty
      warrantyDetails
      otherDetails
      currentLocation
      requiresApproval
    }
  }
`;

export const GET_ITEMS_FOR_SELECTOR = gql`
  query InventoryItemsForSelector($clubid: String) {
    getItems(clubid: $clubid) {
      _id
      iid
      name
      brand
      clubid
      netQty
    }
  }
`;

export const CHECK_ITEM_AVAILABILITY = gql`
  query CheckItemAvailability($iid: String!, $borrowQty: Int!) {
    checkAvailability(iid: $iid, borrowQty: $borrowQty)
  }
`;



export const GET_ALL_TRANSACTIONS = gql`
  query InventoryTransactions(
    $clubid: String
    $itemid: String
    $paginationOn: Boolean
    $skip: Int
    $limit: Int
    $pastTransactionsLimit: Int
    $hideDeleted: Boolean
  ) {
    getTransactions(
      clubid: $clubid
      itemid: $itemid
      paginationOn: $paginationOn
      skip: $skip
      limit: $limit
      pastTransactionsLimit: $pastTransactionsLimit
      hideDeleted: $hideDeleted
    ) {
      _id
      tid
      itemid
      itemName
      itemCode
      itemClubid
      clubid
      clubName
      quantity
      startDate
      endDate
      user
      status {
        state
        submissionTime
        approvedTime
        lastUpdatedTime
        lastUpdatedBy
        borrowDate
        approver
      }
    }
  }
`;

export const GET_PENDING_TRANSACTIONS = gql`
  query PendingInventoryTransactions($clubid: String) {
    getPendingTransactions(clubid: $clubid) {
      _id
      tid
      itemid
      itemName
      itemCode
      itemClubid
      clubid
      quantity
      user
      status {
        state
        submissionTime
        borrowDate
        approver
      }
    }
  }
`;

export const GET_FULL_TRANSACTION = gql`
  query InventoryTransaction($transactionid: String!) {
    getTransaction(tid: $transactionid) {
      _id
      tid
      itemid
      itemName
      itemCode
      itemClubid
      clubid
      clubName
      quantity
      startDate
      endDate
      purpose
      storageLocation
      eventid
      eventName
      user
      remarks
      photoBefore
      photoAfter
      status {
        state
        submissionTime
        approvedTime
        lastUpdatedTime
        lastUpdatedBy
        sloComment
        returnComment
        borrowDate
        approver
      }
    }
  }
`;