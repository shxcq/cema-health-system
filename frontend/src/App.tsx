import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ClientProfile from './components/ClientProfile';
import RegisterClient from './components/RegisterClient';
import CreateProgram from './components/CreateProgram';
import EnrollClient from './components/EnrollClient';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Health System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/register-client">Register Client</Nav.Link>
                  <Nav.Link as={Link} to="/create-program">Create Program</Nav.Link>
                  <Nav.Link as={Link} to="/enroll-client">Enroll Client</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/">Login</Nav.Link>
              )}
            </Nav>
            {isAuthenticated && (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route
          path="/"
          element={<LoginForm onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/create-program" element={<CreateProgram />} />
        <Route path="/enroll-client" element={<EnrollClient />} />
      </Routes>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;