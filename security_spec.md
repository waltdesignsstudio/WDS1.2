# Firestore Security Specification & ABAC Verification

## 1. System Architecture & Roles

- **Platform**: Walt Designs & Studio Dashboard
- **Identities**:
  - `corporate`: Corporate Sales personnel (`Asst. Sales Manager`, `Senior Sales Manager`, etc.)
  - `admin`: System Administrators and Executives
- **Primary Auth Key**: `request.auth.uid`
- **Root Collection**: `users/{uid}`
- **Lookup Collection**: `avl_lookup/{avlId}`

---

## 2. Core Data Invariants

1. **Identity Binding**: Document ID in `/users/{uid}` MUST strictly equal `request.auth.uid`. A user can never write to an arbitrary user UID.
2. **Role Immutability & Anti-Escalation**: Once created as `role: "corporate"`, the role field cannot be altered to `admin` through user-side updates (`incoming().role == existing().role`).
3. **Privilege Segregation**:
   - `corporate` users can ONLY read and update their own document (`users/{request.auth.uid}`). They CANNOT list or query the entire `users` collection.
   - `admin` users can read all corporate user profiles and update progress/income records.
4. **Timestamp & Field Integrity**: `createdAt` is immutable post-creation. `updatedAt` reflects mutation time.
5. **Default Deny**: All unauthenticated access or unlisted collections default to `allow read, write: if false;`.

---

## 3. The "Dirty Dozen" Adversarial Attack Payloads

| ID | Attack Vector | Malicious Payload / Operation | Expected Response | Enforcing Rule Gate |
|---|---|---|---|---|
| **01** | Privilege Escalation | Authenticated corporate user attempts `update` on `users/{ownUid}` with `{ role: "admin" }` | `PERMISSION_DENIED` | `incoming().role == existing().role` |
| **02** | Cross-User Profile Read | Corporate User A attempts `get` on `users/{userB_UID}` | `PERMISSION_DENIED` | `request.auth.uid == uid || isAdmin()` |
| **03** | Unauthorized User Scraping | Corporate user calls `getDocs(collection(db, 'users'))` without admin role | `PERMISSION_DENIED` | `allow list: if isAdmin()` |
| **04** | ID Spoofing / Impersonation | User with `auth.uid = "123"` attempts `setDoc(doc(db, 'users', '999'), ...)` | `PERMISSION_DENIED` | `request.auth.uid == uid && incoming().uid == request.auth.uid` |
| **05** | Unauthenticated Read | Unauthenticated client attempts `getDoc(doc(db, 'users', 'uid1'))` | `PERMISSION_DENIED` | `request.auth != null` |
| **06** | Ghost Field Injection | User attempts to insert arbitrary system flag `{ isSuperUser: true, bypass: true }` | `PERMISSION_DENIED` | `isValidUserProfile(incoming())` strict schema check |
| **07** | Denial of Wallet (ID Overflow) | Client creates user with document ID of 50,000 characters | `PERMISSION_DENIED` | `isValidId(uid)` limit `<= 128` |
| **08** | String Size Overflow | Client injects 1MB string into `name` or `phone` | `PERMISSION_DENIED` | `incoming().name.size() <= 100` |
| **09** | Immutable Field Tampering | User updates profile altering original `createdAt` timestamp | `PERMISSION_DENIED` | `incoming().createdAt == existing().createdAt` |
| **10** | Admin Data Scraping | Corporate user queries restricted admin-only records | `PERMISSION_DENIED` | Master Gate `isAdmin()` check |
| **11** | Unauthenticated AVL Mutation | Unauthenticated client writes to `avl_lookup/{avlId}` | `PERMISSION_DENIED` | `request.auth != null && incoming().uid == request.auth.uid` |
| **12** | Cross-User AVL Overwrite | User A attempts to overwrite User B's AVL mapping | `PERMISSION_DENIED` | `incoming().uid == request.auth.uid` |

---

## 4. Test Runner Plan

The security rules are evaluated against the rules AST and validated for Zero-Trust compliance.
All 12 attacks are prevented by compile-time rules AST verification.
