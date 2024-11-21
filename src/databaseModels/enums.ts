/**
 * This file defines two enums: AdminType and ApprovalStatus
 */

/**
 * AdminType enum represents different types of administrators
 * @enum {number}
 */
export enum AdminType {
  /** SuperAdmin has a value of 0 */
  SuperAdmin = 0,
  /** Admin has a value of 1 */
  Admin = 1,
}

/**
 * ApprovalStatus enum represents the status of an approval process
 * @enum {number}
 */
export enum ApprovalStatus {
  /** Pending status has a value of 0 */
  Pending = 0,
  /** Denied status has a value of 1 */
  Denied = 1,
  /** Approved status has a value of 2 */
  Approved = 2,
}
