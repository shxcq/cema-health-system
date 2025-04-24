import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import './App.css';

interface ClientData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

interface ProgramData {
  name: string;
  description: string;
}

interface EnrollData {
  client_id: string;
  program_id: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [clientData, setClientData] = useState<ClientData>({ first_name: '', last_name: '', email: '', phone: '', date_of_birth: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [programData, setProgramData] = useState<ProgramData>({ name: '', description: '' });
  const [enrollData, setEnrollData] = useState<EnrollData>({ client_id: '', program_id: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/login`, { username, password });
      setToken(response.data.access_token);
      setUsername('');
      setPassword('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/clients`, clientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientData({ first_name: '', last_name: '', email: '', phone: '', date_of_birth: '' });
      setError('');
      alert('Client registered successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register client.');
    }
  };

  const handleSearchClients = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/clients/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search clients.');
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/programs`, programData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgramData({ name: '', description: '' });
      setError('');
      alert('Program created successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create program.');
    }
  };

  const handleEnrollClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/clients/${enrollData.client_id}/programs`, { program_id: enrollData.program_id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollData({ client_id: '', program_id: '' });
      setError('');
      alert('Client enrolled successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to enroll client.');
    }
  };

  return (
    <div className="app-wrapper">
      {!token ? (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <LoginForm
            username={username}
            password={password}
            error={error}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Container>
      ) : (
        <Dashboard
          token={token}
          error={error}
          searchQuery={searchQuery}
          clients={clients}
          clientData={clientData}
          programData={programData}
          enrollData={enrollData}
          setToken={setToken}
          setError={setError}
          setSearchQuery={setSearchQuery}
          setClients={setClients}
          setClientData={setClientData}
          setProgramData={setProgramData}
          setEnrollData={setEnrollData}
          handleSearchClients={handleSearchClients}
          handleRegisterClient={handleRegisterClient}
          handleCreateProgram={handleCreateProgram}
          handleEnrollClient={handleEnrollClient}
        />
      )}
    </div>
  );
};

export default App;