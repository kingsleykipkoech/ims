# Investment Management System (IMS)

A complete MERN-stack web platform designed to manage investor portfolios, track asset ownership, handle bond contributions, and orchestrate complex interest, penalty, and expense flows. The application provides two distinct environments: an **Admin Portal** for total system control, and an **Investor Panel** for clients to monitor and manage their investments.

---

## 🚀 Key Features

### 🏢 **For Administrators**
* **User Management**: Approve and manage investors, tracking their overall portfolio value.
* **Asset & Bond Orchestration**: Create investment vehicles (assets) and fixed-term bonds with specific interest rates and maturity dates.
* **Transaction Approvals**: Review, approve, or reject incoming investor contributions and withdrawal requests.
* **Ownership Allocation**: Assign percentage shares of specific assets to investors, dynamically recalculating total shares upon transaction approvals.
* **Financial Controls**: Set global or categorized interest rates, levy penalties automatically or manually, and track system expenses.
* **Announcements & Auditing**: Publish announcements targeted at specific user groups and maintain an immutable `AuditTrail` of all critical system actions.
* **Document Management**: Securely attach and manage PDF/document files linked to specific assets.

### 💼 **For Investors**
* **Portfolio Dashboard**: Visualize portfolio growth, active assets, and total contributions over time via interactive charts.
* **Contribution Submission**: Submit requests to invest funds into the general pool or link contributions to specific assets/bonds.
* **Financial Tracking**: View a complete history of all personal transactions, earned interest, applied penalties, and finalized bond contributions.
* **Rankings & Standing**: Compare performance metrics and portfolio percentages against the broader investor pool.
* **Announcements**: Receive priority communications directly from administrators.

---

## 🛠️ Technology Stack

**Frontend (Client)**
* **Framework**: React 19 + Vite
* **Styling**: Tailwind CSS, Lucide React (Icons), Emotion/Material-UI
* **Routing**: React Router DOM (v7)
* **Data Visualization**: Recharts
* **Networking**: Axios (with custom interceptors for JWT auth)
* **Alerts**: SweetAlert2

**Backend (Server)**
* **Runtime**: Node.js (>= 18.0)
* **Framework**: Express.js (v5)
* **Database**: MongoDB (Mongoose ORM)
* **Authentication**: JSON Web Tokens (JWT), Access + Refresh token rotation
* **Security**: bcrypt (password hashing), CORS
* **File Uploads**: Multer (Local disk storage)

---

## 🧱 Core Workflows & Logic

### 1. Authentication Flow
The system uses a highly secure dual-token JWT strategy.
1. Users authenticate via `POST /api/auth/login/...`.
2. The server responds with a short-lived **AccessToken (15m)** and a long-lived **RefreshToken (7d)**.
3. The frontend `apiClient` automatically attaches the AccessToken to every outgoing request.
4. If a request fails with `401 Unauthorized`, an Axios interceptor catches it, automatically hits `/api/auth/refresh` with the RefreshToken, receives a new AccessToken, and seamlessly retries the original request without user interruption.

### 2. Contribution & Ownership Calculation
When an investor submits a contribution:
1. A new `Transaction` is created with a status of `pending`.
2. The Admin reviews it. If **Approved**, the transaction status reflects it.
3. The system immediately triggers a background recalculation:
   * It sums the investor's total approved contributions (`total_bonds`).
   * It calculates the total system-wide approved contributions.
   * It proportionally updates the `percentage_share` (0-100%) for **all investors** in the system based on the new total.

### 3. Bond Contributions
Bonds are fixed-term investment vehicles. Administrators outline the terms (months) and interest rates. Investors can directly contribute to a specific bond. Unlike general transactions, `BondContributions` link directly to a `Bond` model and track specific maturity data.

---

## 🗄️ Database Architecture (MongoDB Models)

| Model | Purpose / Description |
|---|---|
| **Admin** | Superuser accounts. Hardcoded initialization via `add_admin_user.js`. |
| **Investor** | Standard client accounts. Tracks `total_bonds` and dynamic `percentage_share`. |
| **Asset** | Represent physical or financial vehicles. Has `name`, `value`, and linked `document` files. |
| **AssetOwnership** | Pivot mapping linking an `Investor` to an `Asset` with an assigned `percentage_share`. |
| **Bond** | Fixed-term investment products defining `term` (duration), `interest_rate`, and `maturity_date`. |
| **BondContribution** | Represents a specific monetary allocation an `Investor` makes toward a `Bond`. |
| **Transaction** | Core ledger for `contribution` (deposits), `interest` (earnings), and `withdrawal` (payouts). Governed by `pending`/`approved`/`rejected` status. |
| **InterestRate** | Historical log of applied rates broken down by category (e.g., general funds, specific bonds). |
| **Penalty** | Deductions applied by admins to an `Investor` for specific reasons. |
| **Expense** | System-wide ledgers for tracking outgoing non-investor funds (platform costs, etc.). |
| **Announcement** | Internal communication system mapping messages to `all`, `investors`, or `admins`. |
| **AuditTrail** | Immutable log tracking `action`, `user_id`, and payload `details` (e.g., updating investors, deleting records). |

---

## 🌐 API Structure Overview

The backend is mounted primarily under `/api` with namespaces breaking down core domains:

*   `/api/auth` — Registration, login (Admin/Investor), and token refresh workflows.
*   `/api/admin` — Master endpoints to fetch and mutate users, global approve/reject transactions, manage announcements and expenses, and access top-level statistical dashboard aggregations.
*   `/api/investor` — Context-aware endpoints returning only the authenticated user's profile, transactions, bonds, interests, penalties, and rankings.
*   `/api/assets` — CRUD for physical/virtual investment vehicles.
*   `/api/bonds` — CRUD for fixed-term bonds and nested endpoints to fetch associated contributions.
*   `/api/ownership` — Management of fractional shares assigned to investors.
*   `/api/reports` — Advanced aggregations generating yearly/monthly contributions and interest distribution statistics using MongoDB `$lookup` pipelines.
*   `/api/documents` — File uploading handlers relying on `multer` to store PDFs/Images locally, linking them back to an `Asset`.
*   `/api` (Root) — Houses floating routers like `InterestRates` and `Penalties`.

---

## ⌨️ Setup & Installation Instructions

### Prerequisites
* Node.js (18.x or higher)
* MongoDB (Locally running on `mongodb://localhost:27017` or Atlas URI)

### 1. Environment Configuration
Create a `.env` in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ims
JWT_SECRET=super_secret_jwt_key_here
JWT_REFRESH_SECRET=super_secret_refresh_key_here
CORS_ORIGIN=http://localhost:5173
```

### 2. Initialization
From the root directory of the project, install all dependencies and start both frontend and backend concurrently:
```bash
# This script installs backend dependencies and starts the backend server
npm run start
# OR run both concurrently (if dev script is configured via recently added fix)
npm run dev
```

### 3. Create First Admin
Run the initialization script from the `backend/` directory to generate your first administrative account:
```bash
cd backend
node add_admin_user.js
```
*(Default credentials are `admin@ims.com` / `admin123` unless overridden in code)*.

### 4. Accessing the System
* **Frontend Application**: `http://localhost:5173`
* **Backend API Console**: `http://localhost:5000/api/health`
* **Admin Login Route**: `/admin-login`
* **Investor Login Route**: `/login`
