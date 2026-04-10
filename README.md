# 📚 Learning Exchange Platform (MERN Stack)

## 🚀 Project Overview

**Learning Exchange** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to enable **peer-to-peer knowledge sharing**.

The platform allows users to **teach, learn, collaborate, and grow together** by creating learning sessions, sharing knowledge through video, and interacting in real-time.

---

## 🎯 Key Features

### 👤 1. User Roles

* **Learners** – Join sessions to gain knowledge
* **Tutors** – Create and conduct learning sessions

---

### 📅 2. Session Creation & Slot Booking

* Tutors can:

  * Create sessions with **title, topic, date, and time slot**
  * Define availability for learners
* Learners can:

  * Browse sessions
  * **Register/book a slot**

---

### 🎥 3. Video-Based Learning

* Sessions support:

  * Video sharing (live or uploaded)
  * Interactive learning experience

---

### 💬 4. Real-Time Chat System

* Each session includes a **chat feature**
* Enables:

  * Doubt clarification
  * Real-time communication between tutor and learners

---

### ⭐ 5. Feedback & Rating System

* After each session:

  * Learners provide **feedback and rating**
* Ratings help:

  * Maintain quality of teaching
  * Build tutor reputation

---

### 💰 6. Smart Payment Logic

* If a tutor’s rating exceeds a defined **threshold**:

  * The session becomes **paid**
  * Users are required to **pay to join**
* Encourages:

  * High-quality teaching
  * Reward-based knowledge sharing

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* CSS / Tailwind (optional)

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Atlas)

### Authentication

* JWT (JSON Web Token)

---

## 🧱 Project Structure

```
learning-exchange/
│
├── frontend/              # React Application
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
│
├── backend/               # Node + Express Server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

---

## 🔐 Core Functional Flow

1. User registers/login
2. Tutor creates a session
3. Learner books a slot
4. Session is conducted via video
5. Chat interaction happens during session
6. After session:

   * Feedback is collected
   * Rating is calculated
7. If rating > threshold:

   * Future sessions become paid

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/learning-exchange.git
cd learning-exchange
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📡 API Modules

* **Auth API** (Login/Register)
* **Session API** (Create, Book, Manage)
* **Chat API** (Real-time messaging)
* **Feedback API** (Rating & review)
* **Payment API** (Conditional access)

---

## 📈 Future Enhancements

* Live video integration (WebRTC / Zoom API)
* Payment gateway (Stripe / Razorpay)
* AI-based tutor recommendation
* Session recording & playback
* Notifications system

---

## 🤝 Contribution

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---


---

💡 *“Teach what you know. Learn what you don’t.”*
