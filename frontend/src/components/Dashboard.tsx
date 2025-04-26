import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch clients.');
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrograms(response.data);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch programs.');
      }
    };

    if (token) {
      fetchClients();
      fetchPrograms();
    } else {
      setError('Please log in to view the dashboard.');
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Dashboard</Card.Title>
          <h5>Clients</h5>
          {clients.length > 0 ? (
            <ul>
              {clients.map((client) => (
                <li key={client.id}>
                  {client.first_name} {client.last_name} - {client.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No clients found.</p>
          )}
          <Button className="mt-3" onClick={() => navigate('/clients')}>
            View All Clients
          </Button>
          <h5 className="mt-4">Programs</h5>
          {programs.length > 0 ? (
            <ul>
              {programs.map((program) => (
                <li key={program.id}>{program.name}</li>
              ))}
            </ul>
          ) : (
            <p>No programs found.</p>
          )}
          <Button className="mt-3" onClick={() => navigate('/programs')}>
            Manage Programs
          </Button>
          <Button className="mt-3 ms-3" variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;