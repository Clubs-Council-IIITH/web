import gql from "graphql-tag";

// ---------------------------------------------------------------------------
// Item mutations
// ---------------------------------------------------------------------------

export const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($details: FullItemInput!) {
    addItem(itemInput: $details) {
      _id
      iid
      name
      brand
      photo
      invoice
      clubid
      netQty
      availableQty
      totalQty
      currentLocation
    }
  }
`;

export const EDIT_INVENTORY_ITEM = gql`
  mutation EditInventoryItem($details: FullItemInput!) {
    editItem(itemInput: $details) {
      _id
      iid
      name
      brand
      photo
      invoice
      clubid
      netQty
      availableQty
      totalQty
      currentLocation
    }
  }
`;

export const EDIT_ITEM_QTY = gql`
  mutation EditItemQty($itemQtyInputs: [ItemQtyInput!]!) {
    editItemQty(itemQtyInputs: $itemQtyInputs) {
      _id
      iid
      availableQty
      netQty
      totalQty
    }
  }
`;

export const ADJUST_AVAILABLE_QTY = gql`
  mutation AdjustAvailableQty($iid: String!, $delta: Int!) {
    adjustAvailableQty(iid: $iid, delta: $delta) {
      _id
      iid
      availableQty
      netQty
      totalQty
    }
  }
`;

// ---------------------------------------------------------------------------
// Transaction mutations
// ---------------------------------------------------------------------------

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($details: CreateTransactionInput!) {
    createTransaction(details: $details) {
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

export const EDIT_TRANSACTION = gql`
  mutation EditTransaction($details: EditTransactionInput!) {
    editTransaction(details: $details) {
      _id
      tid
      status {
        state
      }
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($tid: String!) {
    deleteTransaction(tid: $tid) {
      _id
      tid
      status {
        state
      }
    }
  }
`;

export const SUBMIT_TRANSACTION = gql`
  mutation SubmitTransaction($tid: String!) {
    submitTransaction(tid: $tid) {
      _id
      tid
      status {
        state
      }
    }
  }
`;

/** Cross-club: primary owner club approves the borrow. */
export const APPROVE_CLUB_TRANSACTION = gql`
  mutation ApproveClubTransaction($tid: String!) {
    approveClubTransaction(tid: $tid) {
      _id
      tid
      status {
        state
      }
    }
  }
`;

/** SLO / CC approves the borrow request. */
export const APPROVE_SLO_TRANSACTION = gql`
  mutation ApproveSLOTransaction($tid: String!, $sloComment: String) {
    approveSLOTransaction(tid: $tid, sloComment: $sloComment) {
      _id
      tid
      status {
        state
      }
    }
  }
`;

export const REJECT_TRANSACTION = gql`
  mutation RejectTransaction($tid: String!, $reason: String!) {
    rejectTransaction(tid: $tid, reason: $reason) {
      _id
      tid
      status {
        state
      }
    }
  }
`;

/** SLO or borrowing club confirms item physically picked up. */
export const MARK_BORROWED = gql`
  mutation MarkBorrowed($tid: String!, $photoBefore: String, $remarks: String) {
    markBorrowed(tid: $tid, photoBefore: $photoBefore, remarks: $remarks) {
      _id
      tid
      photoBefore
      remarks
      status {
        state
        borrowDate
      }
    }
  }
`;

/** SLO confirms item returned (optionally with comment + after-photo URL). */
export const RETURN_TRANSACTION = gql`
  mutation ReturnTransaction($details: ReturnTransactionInput!) {
    returnTransaction(details: $details) {
      _id
      tid
      photoAfter
      status {
        state
        returnComment
      }
    }
  }
`;

/** Borrowing club cancels after SLO approval but before pickup. */
export const CANCEL_TRANSACTION = gql`
  mutation CancelTransaction($tid: String!) {
    cancelTransaction(tid: $tid) {
      _id
      tid
      status {
        state
      }
    }
  }
`;