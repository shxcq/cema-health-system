CEMA Health Information System
A full-stack web application for managing healthcare clients and programs, built for the CEMA Software Engineer Intern task.
Challenge Overview
The challenge is to develop a health information system that allows healthcare providers to:

Authenticate users securely.
Register and search for clients.
Create and manage health programs.
Enroll clients in programs.
View client profiles with associated programs.

Solution
This project implements a RESTful API backend with a responsive frontend to meet these requirements. Key features include:

Authentication: Secure login with JWT for user access control.
Client Management: Register new clients, search by name or email, and view detailed profiles.
Program Management: Create and list health programs.
Enrollment: Enroll clients in programs with a many-to-many relationship.
User Interface: Modern, user-friendly interface with React-Bootstrap for a professional look.

Tech Stack

Backend: Flask, Flask-SQLAlchemy (SQLite), Flask-JWT-Extended, Flask-CORS
Frontend: React.js, TypeScript, React-Bootstrap, Axios
Database: SQLite (database.db) with tables: users, clients, programs, client_programs

Setup
Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

Runs on http://localhost:5001.
Frontend
cd frontend
npm install
npm start

Runs on http://localhost:3000.
Database

Located at backend/database.db.
View with sqlite3:sqlite3 backend/database.db
.tables
SELECT * FROM users;



Next Steps

Add API documentation, tests, security features, and deployment (to be implemented).

