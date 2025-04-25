import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchClients();
    }
  }, [token, searchQuery]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/clients/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
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
            <Button variant="primary" type="submit">Search</Button>
          </Form>
        </Col>
      </Row>
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
            <p>No clients found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ClientListPage;