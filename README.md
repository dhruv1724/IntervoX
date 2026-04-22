# IntervoX – Real-Time Coding Interview Platform

IntervoX is a **full-stack coding interview platform** that enables developers to conduct **live technical interviews** with integrated **video calling, real-time chat, and a collaborative coding environment**.
It also includes a **DSA practice section** where users can solve coding problems independently.

---

## Features

* **Secure Authentication** with Clerk
* **Interactive Dashboard** to manage interview sessions
* **DSA Problem Practice** section for individual coding practice
* **Live Coding Environment** powered by Monaco Editor
* **Code Execution** using JDoodle API
* **Real-Time Video Calls** via Stream Video SDK
* **Real-Time Chat** using Stream Chat
* **Session Management**

  * Create sessions
  * Join sessions
  * End sessions
  * Track recent sessions

---

## Tech Stack

**Frontend**

* React (Vite)
* TanStack Query
* Axios
* Monaco Editor

**Backend**

* Node.js
* Express.js
* MongoDB

**Services & Integrations**

* Clerk – Authentication
* Stream – Video & Chat
* Inngest – Event-driven integration between Clerk, MongoDB, and Stream
* JDoodle – Code execution API

---

## Deployment

The application is deployed on **Render**.

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/intervox.git
cd intervox
```

Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

Run the application

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

---

## Author

**Dhruv Gandhi**
Computer Science Engineering Student

