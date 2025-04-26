import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setErrorMessage('Please log in to search clients.');
    }
  }, [token]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients();
  };

  return (
    <Container className="mt-4">
      <h2>Client List</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Form onSubmit={handleSearch}>
            <Form.Group className="mb-3">
              <Form.Label>Search Clients</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!token}>Search</Button>
          </Form>
        </Col>
      </Row>
      {errorMessage && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning">{errorMessage}</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <h3>Clients</h3>
          {clients.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client: any) => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.first_name} {client.last_name}</td>
                    <td>{client.email}</td>
                    <td>
                      <Link to={`/clients/${client.id}`}>
                        <Button variant="outline-primary" size="sm">View Profile</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            !errorMessage && <p>No clients found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ClientListPage;