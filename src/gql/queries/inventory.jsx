import gql from "graphql-tag";

export const GET_ALL_ITEMS = gql`
  query InventoryItems(
    $clubid: String
    $paginationOn: Boolean
    $skip: Int
    $limit: Int
    $status: String
    $hideDeleted: Boolean
  ) {
    inventoryItems(
      clubid: $clubid
      paginationOn: $paginationOn
      skip: $skip
      limit: $limit
      status: $status
      hideDeleted: $hideDeleted
    ) {
      _id
      itemCode
      name
      brand
      quantity
      instock
      clubid
      description
      warrantyDetails
      photo
      billOfPurchase
      status {
        state
        creationTime
        submissionTime
        lastUpdatedTime
        lastUpdatedBy
      }
    }
  }
`;

export const GET_PENDING_ITEMS = gql`
  query PendingInventoryItems($clubid: String) {
    pendingInventoryItems(clubid: $clubid) {
      _id
      itemCode
      name
      brand
      quantity
      clubid
      status {
        state
        submissionTime
      }
    }
  }
`;

export const GET_FULL_ITEM = gql`
  query InventoryItem($itemid: String!) {
    inventoryItem(itemid: $itemid) {
      _id
      itemCode
      name
      brand
      quantity
      instock
      clubid
      description
      warrantyDetails
      photo
      billOfPurchase
      status {
        state
        creationTime
        submissionTime
        lastUpdatedTime
        lastUpdatedBy
        approver
      }
    }
  }
`;

export const GET_ITEMS_FOR_SELECTOR = gql`
  query InventoryItemsForSelector($clubid: String) {
    inventoryItems(clubid: $clubid, hideDeleted: true) {
      _id
      itemCode
      name
      brand
      instock
    }
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
    inventoryTransactions(
      clubid: $clubid
      itemid: $itemid
      paginationOn: $paginationOn
      skip: $skip
      limit: $limit
      pastTransactionsLimit: $pastTransactionsLimit
      hideDeleted: $hideDeleted
    ) {
      _id
      itemid
      itemName
      itemCode
      brand
      clubid
      quantity
      borrow_date
      startDate
      endDate
      purpose
      pickupLocation
      storageLocation
      eventid
      eventName
      user
      status {
        state
        submissionTime
        approvedTime
        lastUpdatedTime
        lastUpdatedBy
      }
    }
  }
`;

export const GET_PENDING_TRANSACTIONS = gql`
  query PendingInventoryTransactions($clubid: String) {
    pendingInventoryTransactions(clubid: $clubid) {
      _id
      itemid
      itemName
      itemCode
      brand
      clubid
      quantity
      borrow_date
      user
      status {
        state
        submissionTime
      }
    }
  }
`;

export const GET_FULL_TRANSACTION = gql`
  query InventoryTransaction($transactionid: String!) {
    inventoryTransaction(transactionid: $transactionid) {
      _id
      itemid
      itemName
      itemCode
      brand
      clubid
      clubName
      quantity
      borrow_date
      startDate
      endDate
      purpose
      pickupLocation
      storageLocation
      eventid
      eventName
      user
      remarks
      approver
      status {
        state
        submissionTime
        approvedTime
        lastUpdatedTime
        lastUpdatedBy
        sloComment
      }
    }
  }
`;