
# 🧑‍💼 MeetJob - Job Portal Web Application

A full-stack Job Portal built using **Spring Boot**, **React.js**, and **MySQL** with **JWT Authentication** and **AWS RDS** integration.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based Sign In / Sign Up)
- 📝 Post and Search Jobs by Title and Location
- 📄 View Job Details and Apply
- 🧠 User role management (USER / ADMIN ready)
- 🌐 Responsive UI with Tailwind CSS and ShadCN
- 💾 Data stored on **AWS RDS (MySQL)**
- 🔄 Secure Login + Logout with Token Management
- ✅ CORS and Axios configured for cross-origin requests

---

## 🧱 Tech Stack

| Frontend     | Backend        | Database    | Auth      | Hosting Ready |
|--------------|----------------|-------------|-----------|----------------|
| React.js     | Spring Boot    | MySQL (RDS) | JWT Token | AWS RDS, Render, Vercel, Netlify |

---

## 📁 Project Structure

```
jobportal-backend/
 └── com.example.jobportal
      ├── model/
      ├── controller/
      ├── repository/
      ├── config/ (Security, JWT)
      ├── service/
      └── util/
jobportal-frontend/
 └── src/
      ├── components/
      ├── pages/
      ├── hooks/
      └── services/
```

---

## ⚙️ Setup Instructions

### ✅ Backend (Spring Boot)

1. Configure `application.properties` with your AWS RDS credentials:
```properties
spring.datasource.url=jdbc:mysql://<rds-endpoint>:3306/jobportal
spring.datasource.username=admin
spring.datasource.password=yourpassword
```

2. Run:
```bash
./mvnw spring-boot:run
```

---

### ✅ Frontend (React.js)

1. Navigate to `jobportal-frontend`
2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm start
```

---

## 🔐 Authentication

- Login & Registration with JWT
- Token is stored in `localStorage`
- Authenticated requests include `Authorization: Bearer <token>`
- Protected Spring Boot endpoints use `SecurityConfig` and `JwtFilter`

---

## 💡 Future Improvements

- Role-based job posting (Admin only)
- Job Application tracking system
- File upload (Resume/CV)
- Pagination + Search Filters

---

## 📸 Screenshots

_(Add your screenshots here if you'd like visual demo)_![image](https://github.com/user-attachments/assets/8a2749e8-5b6e-497c-a367-ce0a90dff217)


---

## 🧑‍💻 Author

Made with ❤️ by [Rohit Rawat]

---

## 📜 License

This project is licensed under the MIT License.
