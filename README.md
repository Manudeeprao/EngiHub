# EngiHub - Engineer Matching & Project Management Platform

<div align="center">

![EngiHub](https://img.shields.io/badge/EngiHub-v1.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**A comprehensive web platform connecting clients with skilled engineers for project execution**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation)

</div>

---

## 📋 Overview

**EngiHub** is a full-stack web application that bridges the gap between clients seeking engineering expertise and engineers looking for project opportunities. The platform uses an intelligent matching algorithm to connect projects with the most suitable engineers based on discipline requirements and experience levels.

### Key Highlights
- 🎯 **Intelligent Matching**: AI-powered algorithm matches engineers based on specialization and experience
- 🔐 **Secure Authentication**: BCrypt password encryption with role-based access
- ⚡ **Atomic Transactions**: Ensures data consistency during project creation with assignments
- 📊 **Real-time Updates**: Instant profile updates and project tracking
- 🚀 **Scalable Architecture**: RESTful API with microservices-ready design

---

## ✨ Features

### For Clients
- ✅ Post projects with specific requirements and budget
- ✅ Search engineers by multiple disciplines
- ✅ View AI-matched engineer profiles with detailed credentials
- ✅ Select and assign preferred engineers to projects
- ✅ Track project status and engineer performance
- ✅ Manage multiple concurrent projects

### For Engineers
- ✅ Build and maintain professional profiles
- ✅ Update specialization, experience, and bio
- ✅ View assigned projects with deadlines
- ✅ Track project progress and status
- ✅ Receive project notifications based on expertise
- ✅ Manage workload across multiple projects

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive styling
- **JavaScript (Vanilla)** - Dynamic interactions, no frameworks
- **RESTful API Integration** - Real-time data fetching

### Backend
- **Java 11+** - Programming language
- **Spring Boot 3.x** - Web framework
- **Spring Data JPA** - ORM with Hibernate
- **Spring Security** - Authentication & authorization
- **BCrypt** - Password encryption

### Database
- **MySQL 8.0** - Relational database
- **JPA Annotations** - Entity mapping

### Tools & Build
- **Maven** - Dependency management and build automation
- **Git** - Version control
- **Postman** - API testing

---

## 📁 Project Structure

```
EngiHub/
├── engihub-backend/              # Spring Boot Backend
│   ├── src/main/java/com/engihub/backend/
│   │   ├── controller/           # REST API Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ProjectController.java
│   │   │   ├── EngineerController.java
│   │   │   ├── MatchController.java
│   │   │   └── AssignmentController.java
│   │   ├── service/              # Business Logic
│   │   │   ├── AuthService.java
│   │   │   ├── ProjectService.java
│   │   │   ├── EngineerService.java
│   │   │   └── MatchService.java
│   │   ├── repository/           # Database Access (JPA)
│   │   ├── model/                # Entity Classes
│   │   │   ├── User.java
│   │   │   ├── Engineer.java
│   │   │   ├── Project.java
│   │   │   └── Assignment.java
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── exception/            # Custom Exceptions
│   │   ├── config/               # Configuration Classes
│   │   └── EngihubBackendApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   ├── pom.xml
│   └── target/                   # Compiled JAR
│
├── frontend/                      # Frontend Files
│   ├── index.html                # Home page
│   ├── login.html                # Login page
│   ├── signup.html               # Registration page
│   ├── page.html                 # Client dashboard
│   ├── eng.html                  # Engineer dashboard
│   ├── scripts.js                # Shared utilities
│   ├── login.js                  # Login logic
│   ├── page.js                   # Client dashboard logic
│   ├── eng.js                    # Engineer dashboard logic
│   ├── styles.css                # Global styles
│   ├── login.css                 # Login page styles
│   ├── eng.css                   # Engineer dashboard styles
│   └── page.css                  # Client dashboard styles
│
├── README.md                      # This file
├── PROJECT_COMPLETE_DOCUMENTATION.md  # Detailed documentation
└── XAMPP_INSERT_70_ENGINEERS_FIXED.sql # Test data
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Java 11+** installed
- **Maven 3.6+** installed
- **MySQL 8.0+** running
- **Node.js/npm** (optional, for Live Server)
- **Git** for version control

### Backend Setup

#### 1. Clone Repository
```bash
git clone https://github.com/Manudeeprao/EngiHub.git
cd EngiHub/engihub-backend
```

#### 2. Configure Database
Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/engihub
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

#### 3. Create Database
```sql
CREATE DATABASE engihub;
USE engihub;
```

#### 4. Load Test Data (Optional)
```bash
# In MySQL/phpMyAdmin
# Open XAMPP_INSERT_70_ENGINEERS_FIXED.sql
# Execute the full script to insert 70 test engineers
```

#### 5. Build & Run Backend
```bash
# Build the project
mvn clean package -DskipTests

# Run the Spring Boot application
java -jar target/engihub-backend-0.0.1-SNAPSHOT.jar

# Alternative: Run with Maven
mvn spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

### Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 2. Start Local Server (Choose One)

**Option A: Using Live Server (VS Code)**
- Install "Live Server" extension in VS Code
- Right-click `login.html` → "Open with Live Server"
- Runs on `http://127.0.0.1:5500`

**Option B: Using Python**
```bash
# Python 3.x
python -m http.server 5500

# Python 2.x
python -m SimpleHTTPServer 5500
```

**Option C: Using Node.js**
```bash
npm install -g http-server
http-server -p 5500
```

**Frontend runs on:** `http://127.0.0.1:5500`

---

## 📖 Usage Guide

### 1. **Access the Application**
```
Frontend: http://127.0.0.1:5500
Backend:  http://localhost:8080
Database: localhost:3306 (MySQL)
```

### 2. **Login/Signup**
```
URL: http://127.0.0.1:5500/frontend/login.html

Test Credentials (Pre-loaded):
- Email: engineer1@engihub.com to engineer70@engihub.com
- Password: password123

Or signup as a new client:
- Email: yourname@example.com
- Password: securepassword
```

### 3. **Client Workflow**

**Step 1: Post a Project**
```
1. Login as Client
2. Click "Post a New Project"
3. Fill form:
   - Title: "Bridge Construction"
   - Description: "Design and build a pedestrian bridge"
   - Disciplines: ✓ Civil Engineer, ✓ Structural Engineer
   - Budget: 50,000
   - Start Date: 2025-01-15
   - End Date: 2025-06-30
4. Click "Find Engineers"
```

**Step 2: Review Matched Engineers**
```
Backend Algorithm:
- Filters engineers by selected disciplines
- Scores based on experience (>10 years: +10, >5 years: +5)
- Selects top 5 using round-robin from each specialty
- Returns matched engineer cards

Frontend Display:
- Engineer name, specialization, experience, bio
- Checkbox to select/deselect
```

**Step 3: Assign Engineers**
```
1. Select desired engineers
2. Click "Proceed with Team"
3. Project created atomically with assignments
4. Confirmation: "Project created with 3 engineers assigned"
```

### 4. **Engineer Workflow**

**View Assigned Projects**
```
1. Login as Engineer
2. Go to Dashboard
3. View assigned projects with:
   - Project title & description
   - Client name & budget
   - Timeline & status
   - Days remaining (color-coded)
```

**Update Profile**
```
1. Click "Edit Profile"
2. Update Bio: "Experienced in structural analysis..."
3. Update Experience: "12 years"
4. Click "Save Changes"
5. Profile updates in database immediately
6. Page refreshes to show new data
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "engineer1@engihub.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "id": 1,
  "role": "ENGINEER"
}
```

#### Signup
```http
POST /auth/signup
Content-Type: application/json

Request:
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "CLIENT"
}

Response:
{
  "success": true,
  "message": "Signup successful"
}
```

#### Get User ID
```http
GET /auth/getUserId?email=engineer1@engihub.com

Response:
{
  "id": 1,
  "email": "engineer1@engihub.com",
  "role": "ENGINEER"
}
```

### Engineer Endpoints

#### Get All Engineers
```http
GET /engineers/all

Response:
[
  {
    "id": 1,
    "name": "John Smith",
    "specialization": "Civil Engineer",
    "experience": "8 years",
    "bio": "Expert in civil infrastructure projects."
  },
  ...
]
```

#### Get Engineers by Specialization
```http
GET /engineers/category/Civil%20Engineer

Response: [array of engineers with that specialization]
```

#### Update Engineer Profile
```http
PUT /engineers/update/1?bio=Structural%20expert&experience=12%20years

Response:
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### Matching Endpoints

#### Get Matched Engineers
```http
GET /match/byDisciplines?disciplines=Civil%20Engineer,Mechanical%20Engineer

Response:
[
  {
    "id": 5,
    "name": "Alice Cooper",
    "specialization": "Civil Engineer",
    "experience": "12 years",
    "bio": "Senior civil engineer with bridge design expertise.",
    "score": 65
  },
  ...
]
```

**Scoring Algorithm:**
- Exact discipline match: +50 points
- Experience > 10 years: +10 points
- Experience > 5 years: +5 points
- Top 5 engineers returned (round-robin distributed)

### Project Endpoints

#### Create Project with Assignments
```http
POST /projects/createWithAssignments
Content-Type: application/json

Request:
{
  "clientId": 1,
  "title": "Bridge Construction",
  "description": "Design and build a pedestrian bridge",
  "disciplines": "Civil Engineer,Structural Engineer",
  "budget": 50000,
  "startDate": "2025-01-15",
  "endDate": "2025-06-30",
  "engineerIds": [5, 12, 18]
}

Response:
{
  "success": true,
  "message": "Project created successfully with assignments",
  "projectId": 1
}
```

### Assignment Endpoints

#### Get Assigned Projects
```http
GET /assignments/engineer/1

Response:
[
  {
    "id": 1,
    "title": "Bridge Construction",
    "description": "Design and build a pedestrian bridge",
    "clientName": "John Doe",
    "budget": 50000,
    "startDate": "2025-01-15",
    "endDate": "2025-06-30",
    "status": "Open",
    "remainingDays": 45
  },
  ...
]
```

---

## 🗄️ Database Schema

### users table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ENGINEER', 'CLIENT') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### engineers table
```sql
CREATE TABLE engineers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience VARCHAR(100),
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### projects table
```sql
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  disciplines VARCHAR(500),
  budget DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  status ENUM('Open', 'Closed') DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id)
);
```

### assignments table
```sql
CREATE TABLE assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  engineer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (engineer_id) REFERENCES engineers(id)
);
```

---

## 🔐 Security

### Authentication
- **BCrypt Password Hashing**: Cost factor 10
- **CORS Enabled**: For cross-origin frontend requests
- **Session Management**: localStorage for client-side storage
- **Role-Based Access**: ENGINEER and CLIENT roles

### Example Password Hash
```
Plain Text: password123
BCrypt Hash: $2a$10$N9qo8ucoathVjHzz6qkH.OrEUVVGG8J9O0.cZfnDJmMQvIm7HVtU2
```

### Best Practices
- Never store plain-text passwords
- Always use HTTPS in production
- Implement rate limiting for API endpoints
- Add JWT tokens for stateless authentication
- Use environment variables for sensitive config

---

## 🧪 Testing

### Manual Testing Steps

#### Test 1: Create Project & Assign Engineers
```
1. Login as Client
2. Post new project with Civil Engineer discipline
3. Click "Find Engineers" → Verify matched engineers display
4. Select 2-3 engineers → Click "Proceed with Team"
5. Verify project created in database
6. Check assignments table has new rows
```

#### Test 2: Engineer Profile Update
```
1. Login as engineer1@engihub.com (password123)
2. Click "Edit Profile"
3. Change Experience: "12 years"
4. Change Bio: "Structural analysis expert"
5. Click "Save Changes"
6. Refresh page → Verify changes persist
7. Check database for updated values
```

#### Test 3: View Assigned Projects
```
1. Login as engineer assigned to a project
2. Go to Dashboard
3. Verify assigned projects display
4. Check project details accuracy
5. Verify timeline calculations
```

### Automated Testing (Future)
```bash
# Unit Tests
mvn test

# Integration Tests
mvn verify
```

---

## 📊 Test Data

### Pre-loaded Engineers (70 total)
- **Civil Engineers**: 10 engineers
- **Mechanical Engineers**: 10 engineers
- **Electrical Engineers**: 10 engineers
- **Computer Engineers**: 5 engineers
- **Chemical Engineers**: 8 engineers
- **Structural Engineers**: 6 engineers
- **Aerospace Engineers**: 5 engineers
- **Biomedical Engineers**: 4 engineers
- **Data Engineers**: 3 engineers
- **Systems Engineers**: 3 engineers
- **Automotive Engineers**: 2 engineers
- **Petroleum Engineers**: 2 engineers
- **Agricultural Engineers**: 2 engineers
- **Robotics Engineers**: 2 engineers

### Login Credentials
```
Email Format: engineer1@engihub.com to engineer70@engihub.com
Password: password123 (all engineers)
Role: ENGINEER
```

---

## 🚧 Future Enhancements

- [ ] JWT token-based authentication
- [ ] Advanced filtering and search
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Project review and rating system
- [ ] Engineer availability calendar
- [ ] Budget tracking and invoicing
- [ ] Mobile app (React Native/Flutter)
- [ ] Admin dashboard
- [ ] Analytics and reporting

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port 8080 is not in use
netstat -ano | findstr :8080

# Kill process if needed
taskkill /PID <PID> /F

# Rebuild and restart
mvn clean package -DskipTests
java -jar target/engihub-backend-0.0.1-SNAPSHOT.jar
```

### Database connection error
```bash
# Verify MySQL is running
# Check application.properties has correct credentials
# Ensure database exists: CREATE DATABASE engihub;
```

### Frontend can't reach backend
```bash
# Verify backend is running on http://localhost:8080
# Check CORS is enabled in application (it is by default)
# Check browser console for specific error messages
```

### Login fails (401 error)
```bash
# Verify correct credentials
# Check user exists in database
# Ensure password hash is correct
# Check BCrypt library is imported correctly
```

---

## 📞 Support & Contact

**Project Repository**: [GitHub - EngiHub](https://github.com/Manudeeprao/EngiHub)

**Issues & Bugs**: Please create a GitHub issue with:
- Detailed description of the problem
- Steps to reproduce
- Screenshots/logs
- Environment details (OS, Java version, etc.)

**Contributions**: Pull requests are welcome! Please follow the existing code style.

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Manudeep Rao**

---

## 🙏 Acknowledgments

- Spring Boot documentation and community
- MySQL official guides
- Bootstrap and CSS best practices
- OpenAI for assistance in project development

---

<div align="center">

**Made with ❤️ for the engineering community**

⭐ If you find this project helpful, please consider giving it a star!

</div>
