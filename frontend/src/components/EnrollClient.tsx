import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const EnrollClient: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchClients();
      fetchPrograms();
    } else {
      setError('Please log in to enroll clients.');
    }
  }, [token]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !selectedProgram) {
      setError('Please select both a client and a program.');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5001/api/clients/${selectedClient}/programs`,
        { program_id: selectedProgram },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Client enrolled successfully!');
      setError('');
      setSelectedClient('');
      setSelectedProgram('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enroll client.');
      setSuccess('');
    }
  };

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Enroll Client in Program</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Client</Form.Label>
                  <Form.Select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map((client: any) => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name} ({client.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Program</Form.Label>
                  <Form.Select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    required
                  >
                    <option value="">Select a program</option>
                    {programs.map((program: any) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={!token}>Enroll Client</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EnrollClient;