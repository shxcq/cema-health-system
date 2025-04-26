import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { House, PersonPlus, FileMedical, PersonCheck, ListUl, BoxArrowRight, List } from 'react-bootstrap-icons';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ClientProfile from './components/ClientProfile';
import RegisterClient from './components/RegisterClient';
import CreateProgram from './components/CreateProgram';
import EnrollClient from './components/EnrollClient';
import ClientListPage from './components/ClientListPage';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="app-wrapper">
      {isAuthenticated ? (
        <>
          {/* Sidebar */}
          <div className={`sidebar ${isSidebarExpanded ? 'expanded' : ''}`}>
            <div className="sidebar-header">
              <h3>Health System</h3>
            </div>
            <Nav className="sidebar-nav">
              <Nav.Link as={Link} to="/dashboard" className="sidebar-link">
                <House className="sidebar-icon" />
                <span>Dashboard</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/register-client" className="sidebar-link">
                <PersonPlus className="sidebar-icon" />
                <span>Register Client</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/create-program" className="sidebar-link">
                <FileMedical className="sidebar-icon" />
                <span>Create Program</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/enroll-client" className="sidebar-link">
                <PersonCheck className="sidebar-icon" />
                <span>Enroll Client</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/client-list" className="sidebar-link">
                <ListUl className="sidebar-icon" />
                <span>Client List</span>
              </Nav.Link>
            </Nav>
            <div className="sidebar-logout">
              <Button
                variant="link"
                onClick={handleLogout}
                className="sidebar-link p-0"
              >
                <BoxArrowRight className="sidebar-icon" />
                <span>Logout</span>
              </Button>
            </div>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
              <List className="sidebar-toggle-icon" />
            </div>
          </div>

          {/* Main Content */}
          <div className={`main-content ${isSidebarExpanded ? 'expanded' : ''}`}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients/:id" element={<ClientProfile />} />
              <Route path="/register-client" element={<RegisterClient />} />
              <Route path="/create-program" element={<CreateProgram />} />
              <Route path="/enroll-client" element={<EnrollClient />} />
              <Route path="/client-list" element={<ClientListPage />} />
              <Route
                path="/"
                element={<LoginForm onLogin={() => setIsAuthenticated(true)} />}
              />
            </Routes>
          </div>
        </>
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