import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { House, PersonPlus, FileMedical, PersonCheck, BoxArrowRight } from 'react-bootstrap-icons';
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
    <div className="app-wrapper">
      {isAuthenticated ? (
        <Row className="g-0">
          {/* Sidebar */}
          <Col md={2} className="sidebar">
            <div className="sidebar-header">
              <h3>Health System</h3>
            </div>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/dashboard" className="sidebar-link">
                <House className="sidebar-icon" /> Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/register-client" className="sidebar-link">
                <PersonPlus className="sidebar-icon" /> Register Client
              </Nav.Link>
              <Nav.Link as={Link} to="/create-program" className="sidebar-link">
                <FileMedical className="sidebar-icon" /> Create Program
              </Nav.Link>
              <Nav.Link as={Link} to="/enroll-client" className="sidebar-link">
                <PersonCheck className="sidebar-icon" /> Enroll Client
              </Nav.Link>
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="sidebar-logout mt-3"
              >
                <BoxArrowRight className="sidebar-icon" /> Logout
              </Button>
            </Nav>
          </Col>
          {/* Main Content */}
          <Col md={10} className="main-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients/:id" element={<ClientProfile />} />
              <Route path="/register-client" element={<RegisterClient />} />
              <Route path="/create-program" element={<CreateProgram />} />
              <Route path="/enroll-client" element={<EnrollClient />} />
              <Route
                path="/"
                element={<LoginForm onLogin={() => setIsAuthenticated(true)} />}
              />
            </Routes>
          </Col>
        </Row>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<LoginForm onLogin={() => setIsAuthenticated(true)} />}
          />
          <Route path="*" element={<LoginForm onLogin={() => setIsAuthenticated(true)} />} />
        </Routes>
      )}
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;