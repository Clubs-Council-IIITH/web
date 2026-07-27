import gql from "graphql-tag";

export const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($details: InputInventoryItemDetails!) {
    createInventoryItem(details: $details) {
      _id
    }
  }
`;

export const EDIT_INVENTORY_ITEM = gql`
  mutation EditInventoryItem($details: InputEditInventoryItemDetails!) {
    editInventoryItem(details: $details) {
      _id
    }
  }
`;

export const DELETE_INVENTORY_ITEM = gql`
  mutation DeleteInventoryItem($itemid: String!) {
    deleteInventoryItem(itemid: $itemid) {
      _id
    }
  }
`;

export const APPROVE_INVENTORY_ITEM = gql`
  mutation ApproveInventoryItem($itemid: String!) {
    approveInventoryItem(itemid: $itemid) {
      _id
    }
  }
`;

export const REJECT_INVENTORY_ITEM = gql`
  mutation RejectInventoryItem($itemid: String!, $reason: String) {
    rejectInventoryItem(itemid: $itemid, reason: $reason) {
      _id
    }
  }
`;

export const SUBMIT_INVENTORY_ITEM = gql`
  mutation SubmitInventoryItem($itemid: String!) {
    submitInventoryItem(itemid: $itemid) {
      _id
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($details: InputTransactionDetails!) {
    createTransaction(details: $details) {
      _id
    }
  }
`;

export const EDIT_TRANSACTION = gql`
  mutation EditTransaction($details: InputEditTransactionDetails!) {
    editTransaction(details: $details) {
      _id
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionid: String!) {
    deleteTransaction(transactionid: $transactionid) {
      _id
    }
  }
`;

export const SUBMIT_TRANSACTION = gql`
  mutation SubmitTransaction($transactionid: String!) {
    submitTransaction(transactionid: $transactionid) {
      _id
    }
  }
`;

export const APPROVE_SLO_TRANSACTION = gql`
  mutation ApproveSLOTransaction($transactionid: String!, $sloComment: String) {
    approveSLOTransaction(transactionid: $transactionid, sloComment: $sloComment) {
      _id
      status {
        state
      }
    }
  }
`;

export const REJECT_TRANSACTION = gql`
  mutation RejectTransaction($transactionid: String!, $reason: String!) {
    rejectTransaction(transactionid: $transactionid, reason: $reason) {
      _id
      status {
        state
      }
    }
  }
`;