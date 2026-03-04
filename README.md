# SmartPark - Parking System Management System (PSSMS)
**Developed by: witfab dev**

A full-stack parking management solution built for the 7-hour practical assessment. This system handles car registration, real-time slot tracking, automated billing (500 RWF/hr), and professional invoice generation.

---

## 🚀 Quick Start (Development Mode)

This project uses `concurrently` to run both the frontend and backend with a single command.

1.  **Start XAMPP**: Ensure Apache and MySQL are running.
2.  **Import Database**: 
    * Open [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
    * Create a database named `PSSMS`.
    * Import the provided `pssms_db.sql` file.
3.  **Install Dependencies**:
    From the root folder, run:
    ```bash
    npm install
    cd backend-project && npm install
    cd ../frontend-project && npm install
    cd ..
    ```
4.  **Run the App**:
    ```bash
    npm run dev
    ```
    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Backend:** [http://localhost:3001](http://localhost:3001)

---

## 🔑 Login Credentials
* **Username:** `admin`
* **Password:** `admin123`

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Axios, Lucide React (Icons).
* **Backend:** Node.js, Express.js, Nodemon (Auto-reload).
* **Database:** MariaDB/MySQL (via XAMPP).
* **Authentication:** Bcrypt.js (Password encryption).

---

## 📋 Key Features (Requirements Met)
- [x] **Req 8 (CRUD):** Full management of Cars, Parking Slots, and Entry Records.
- [x] **Req 10 (Auth):** Secure login with encrypted passwords.
- [x] **Req 12 (Billing):** Automated duration calculation at **500 RWF per hour**.
- [x] **Req 12 (Invoice):** Digital receipt generation with browser print support.
- [x] **Reports:** Daily transaction summaries and revenue tracking.

---

## 📂 Project Structure
```text
PSS-MASTER/
├── backend-project/      # Node.js & Express API
│   ├── server.js         # Main entry point
│   └── package.json
├── frontend-project/     # React Application
│   ├── src/              # Components & UI
│   └── package.json
├── pssms_db.sql          # Database Schema & Sample Data
└── package.json          # Root configuration for 'concurrently'
---

### Why this README helps you pass:
1.  **Clarity:** The assessor doesn't have to guess how to start your app.
2.  **Professionalism:** It highlights that you used **Bcrypt** for security and **Concurrently** for workflow.
3.  **Checklist:** Explicitly stating that you met **Requirement 8, 10, and 12** makes it easier for them to give you marks.



**Is there anything else you need before you zip up your project for submission? Good luck with your defense!**