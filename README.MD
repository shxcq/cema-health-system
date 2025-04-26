Health Information System
A web application for doctors to manage health programs and clients, built with a Flask backend and React frontend. This project was developed as part of the Software Engineering Intern Task, focusing on clean code, usability, and extensibility.
The system allows doctors to create health programs (e.g., TB, Malaria, HIV), register clients, enroll clients in programs, search for clients, view client profiles, and expose client data via a RESTful API. It features a modern UI with React-Bootstrap, secure authentication with JWT, and a SQLite database for data persistence.

Features

Create Health Programs: Doctors can create programs with names and descriptions (e.g., TB, HIV) using CreateProgram.tsx and SettingsPage.tsx.
Register Clients: Register new clients with details like first_name, last_name, email, and emergency_contact via RegisterClient.tsx.
Enroll/Unenroll Clients: Enroll clients in programs using EnrollClient.tsx or manage enrollments in ClientProfile.tsx.
Search Clients: Search for clients by name or email using ClientListPage.tsx, with case-insensitive search powered by ilike.
View Client Profiles: View client details and enrolled programs in a two-column layout with ClientProfile.tsx.
Secure API: RESTful API with JWT authentication, CORS restrictions, and input validation.
Responsive UI: Modern design with React-Bootstrap and custom styles in frontend/src/App.css.


Project Structure
health-information-system/
├── backend/
│   ├── __pycache__/
│   ├── instance/
│   │   └── health_system.db
│   ├── tests/
│   ├── venv/
│   ├── app.py              # Flask app setup
│   ├── config.py           # Configuration (e.g., JWT secret, CORS)
│   ├── models.py           # Database models (Client, Program, client_program)
│   ├── requirements.txt    # Backend dependencies
│   └── routes.py           # API routes
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClientListPage.tsx    # Search and list clients
│   │   │   ├── ClientProfile.tsx     # View/edit client details
│   │   │   ├── CreateProgram.tsx     # Create new programs
│   │   │   ├── Dashboard.tsx         # System overview
│   │   │   ├── EnrollClient.tsx      # Enroll clients in programs
│   │   │   ├── LoginForm.tsx         # Doctor login
│   │   │   ├── RegisterClient.tsx    # Register new clients
│   │   │   └── SettingsPage.tsx      # Manage programs
│   │   ├── App.css                   # Custom styles
│   │   ├── App.tsx                   # Main React app
│   │   └── index.css                 # Global styles
│   ├── package-lock.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── docs/
    ├── Health_Information_System_Presentation.pdf
    └── Health_Information_System_Report.docx


Prerequisites

Python 3.8+: For the Flask backend.
Node.js 16+ and npm: For the React frontend.
SQLite: Used as the database (already included as health_system.db).
Git: To clone the repository.


Installation

Clone the Repository:
git clone https://github.com/your-username/health-information-system.git
cd health-information-system


Set Up the Backend:

Navigate to the backend directory:cd backend


Create a virtual environment and activate it:python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install dependencies:pip install -r requirements.txt


Note: The backend uses flask-cors to allow requests from http://localhost:3000. This was added to fix a CORS policy error blocking frontend requests (as discussed previously).


Set Up the Frontend:

Navigate to the frontend directory:cd ../frontend


Install dependencies:npm install


Note: The frontend uses React-Bootstrap for UI components and Axios for API requests.


Database Setup:

The SQLite database (health_system.db) is already included in backend/instance.
If you need to reseed the database, run:cd backend
python seed.py


Note: Ensure there are no duplicate program.name entries in seed.py to avoid UNIQUE constraint errors (as resolved previously).




Usage

Run the Backend:

From the backend directory, with the virtual environment activated:python app.py


The Flask server will run on http://localhost:5001.
Note: The backend includes JWT authentication. The default credentials are username: doctor, password: password. Ensure the user.id in create_access_token is passed as a string to avoid JWT validation errors (e.g., 'Subject must be a string'), as fixed previously.


Run the Frontend:

From the frontend directory, in a separate terminal:npm run start


The React app will run on http://localhost:3000.


Access the App:

Open http://localhost:3000 in your browser.
Log in with the default credentials (doctor/password) using LoginForm.tsx.
Use the app to:
Create programs in SettingsPage.tsx or CreateProgram.tsx.
Register clients in RegisterClient.tsx.
Enroll clients in programs using EnrollClient.tsx or ClientProfile.tsx.
Search for clients in ClientListPage.tsx.
View client profiles in ClientProfile.tsx.






API Endpoints
The backend provides the following RESTful API endpoints (all require JWT authentication):

Clients:

POST /api/clients: Register a new client.
GET /api/clients: List all clients.
PUT /api/clients/<id>: Update a client.
GET /api/clients/<id>: View a client’s profile.
GET /api/clients/search: Search clients by name or email.


Programs:

POST /api/programs: Create a new program.
GET /api/programs: List all programs.
PUT /api/programs/<id>: Update a program.


Enrollments:

POST /api/clients/<id>/programs: Enroll a client in a program.
DELETE /api/clients/<id>/programs: Unenroll a client from a program.


Authentication:

POST /api/login: Authenticate and receive a JWT token.

Future Improvements

Unit Tests: Add tests in backend/tests to validate API endpoints (e.g., /api/clients POST).
Password Hashing: Hash doctor passwords in backend/config.py (currently plaintext: doctor/password) using a library like bcrypt.
Deployment: Deploy the app to Render for public access.
Enhanced UI: Add more visual elements like charts in Dashboard.tsx to show client and program statistics.


Documentation
Additional documentation is available in the docs folder:

PowerPoint Presentation: Slides covering the approach, design, and solution.
Word Document Report: Detailed report with code snippets and explanations.


Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a pull request.

Please ensure your code follows the project’s style guidelines and includes tests where applicable.

License
This project is licensed under the MIT License. See the LICENSE file for details.
