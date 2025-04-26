import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const fetchClients = async () => {
    if (!token) {
      setErrorMessage('Please log in to search clients.');
      setClients([]);
      return;
    }
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a name or email to search.');
      setClients([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/clients/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
      setErrorMessage('');
    } catch (err: any) {
      console.error('Failed to fetch clients:', err.response?.data, err.response?.status);
      setErrorMessage(err.response?.data?.message || 'Failed to fetch clients. Please try again.');
      setClients([]);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        fetchClients();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients();
  };

  return (
    <Container className="mt-4">
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Search Clients</Card.Title>
          <Form onSubmit={handleSearch} className="mb-3">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">Search</Button>
          </Form>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {clients.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{`${client.first_name} ${client.last_name}`}</td>
                    <td>{client.email}</td>
                    <td>
                      <Link to={`/clients/${client.id}`} className="btn btn-info btn-sm">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No clients found.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientListPage;