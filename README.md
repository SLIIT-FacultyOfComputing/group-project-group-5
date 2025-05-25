
# 🏋️‍♂️ GymSync – Seamless Gym Management  

> **Effortless gym member & equipment management at your fingertips**  

![GymSync](https://img.shields.io/badge/GymSync-Management-blue.svg)  
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-green.svg)  
![React](https://img.shields.io/badge/Frontend-React-blue.svg)  
![Database](https://img.shields.io/badge/Database-MySQL-yellow.svg)  

---

## 📌 Project Overview  

**GymSync** is a full-featured **Gym Management System (GMS)** that streamlines membership management, trainer records, billing, and equipment maintenance. Built with **Spring Boot (Java)** for the backend and **Vite + React with Tailwind CSS** for the frontend, it provides a modern and efficient solution for gyms.  

### 🎯 Features  
✅ **Membership Management** – Register, track, and renew gym memberships.  
✅ **Trainer & Staff Records** – Maintain trainer details and certifications.  
✅ **Payment & Billing** – Handle transactions, invoices, and payment history.  
✅ **Equipment Maintenance** – Monitor gym equipment status, raise tickets, and track repairs.  

---

## 🏗️ Tech Stack  

| Component  | Technology |
|------------|-------------|
| **Frontend**  | React (Vite) ⚡ + Tailwind CSS 🎨 |
| **Backend**  | Spring Boot 🚀 + REST APIs |
| **Database**  | MySQL 🛢️ |

---

## 📂 Project Structure  

```
GymSync/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/com/gymsync
│   │   ├── controller/       # REST API Controllers
│   │   ├── service/          # Business Logic Services
│   │   ├── repository/       # Database Repositories
│   │   ├── model/            # Data Models (Entities)
│   ├── src/main/resources/   # Application Configs
│   ├── pom.xml               # Maven Dependencies
│
├── frontend-user/            # User Frontend
│   ├── src/components/       # UI Components
│   ├── src/pages/            # Pages & Views
│   ├── src/api.js            # API Calls
│
├── frontend-admin/           # Admin Frontend
│   ├── src/components/       # UI Components
│   ├── src/pages/            # Pages & Views
│   ├── src/api.js            # API Calls
│
├── frontend-staff/           # Staff Frontend
│   ├── src/components/       # UI Components
│   ├── src/pages/            # Pages & Views
│   ├── src/api.js            # API Calls
│
├── README.md                 # Project Documentation
```

---

## 🚀 Getting Started  

### 🔹 Prerequisites  
- **Node.js** v16+ & **npm**  
- **Java** 17+  
- **MySQL Server**  

### 🔹 Database Setup  
1. Install MySQL and create a database.  
2. Update `application.properties` with your MySQL credentials.  
3. Run database migrations if needed.  

### 🔹 Backend Setup  
```sh
cd backend
./mvnw spring-boot:run
```

### 🔹 Frontend Setup  

#### User Frontend  
```sh
cd frontend-user
npm install
npm run dev
```

#### Admin Frontend  
```sh
cd frontend-admin
npm install
npm run dev
```

#### Staff Frontend  
```sh
cd frontend-staff
npm install
npm run dev
```

---

## 🔧 API Endpoints  

### 🎟️ Equipment Management  
| Method | Endpoint | Description |
|--------|-------------|------------|
| **GET** | `/api/equipment` | Get all equipment |
| **POST** | `/api/equipment` | Add new equipment |
| **PUT** | `/api/equipment/{id}` | Update equipment details |
| **DELETE** | `/api/equipment/{id}` | Remove equipment |

### 🛠️ Maintenance Tracking  
| Method | Endpoint | Description |
|--------|-------------|------------|
| **POST** | `/api/maintenance` | Log maintenance request |
| **GET** | `/api/maintenance` | Fetch maintenance records |

More endpoints for **members, trainers, and payments** can be found in the API docs 📖.  

---

## 👥 Contributors  

👤 **Gunawardhana D N**  
👤 **Nonis P.K.D.T.**  
👤 **Jayawardhana P A L R**  
👤 **Dissanayake D M D C**  

💡 *Project for SE2012 Object-Oriented Analysis & Design – Group Assignment (Y2S1 2025)*  

---

## 🌟 Future Enhancements  
✅ **Mobile App Integration 📱**  
✅ **AI-based Equipment Failure Prediction 🤖**  
✅ **Automated Membership Reminders 📩**  

---

## 📜 License  
📝 **MIT License** – Use and modify freely!  

---
