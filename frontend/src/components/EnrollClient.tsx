import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const EnrollClient: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
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
      fetchPrograms();
    } else {
      setError('Please log in to enroll a client.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) {
      setError('Please select a program.');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5001/api/clients/${clientId}/programs`,
        { program_id: selectedProgram },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Client enrolled successfully!');
      setError('');
      setTimeout(() => navigate(`/clients/${clientId}`), 1000);
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
            <Form.Group className="mb-3">
              <Form.Label>Select Program</Form.Label>
              <Form.Select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!token}>
              Enroll Client
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Button
        className="mt-3"
        variant="secondary"
        onClick={() => navigate(`/clients/${clientId}`)}
      >
        Back to Profile
      </Button>
    </Container>
  );
};

export default EnrollClient;