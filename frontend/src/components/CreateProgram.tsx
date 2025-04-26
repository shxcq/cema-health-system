import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const CreateProgram: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Program name is required.');
      return;
    }
    try {
      await axios.post('http://localhost:5001/api/programs', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Program created successfully!');
      setError('');
      setFormData({ name: '', description: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create program.');
      setSuccess('');
    }
  };

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Create New Program</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Program Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!token}>Create Program</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateProgram;