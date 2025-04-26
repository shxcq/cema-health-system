import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (token && id) {
      fetchClient();
    }
  }, [id, token]);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient(response.data);
      setFormData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load client profile.');
    }
  };

  const handleUnenroll = async (programId: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/clients/${id}/programs/${programId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient({
        ...client,
        programs: client.programs.filter((p: any) => p.id !== programId),
      });
      setSuccess('Client unenrolled successfully!');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unenroll client.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.date_of_birth) {
      delete payload.date_of_birth;
    }
    try {
      await axios.put(`http://localhost:5001/api/clients/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient(payload);
      setEditMode(false);
      setSuccess('Client updated successfully!');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update client.');
      setSuccess('');
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="chart-card client-profile-card">
        <Card.Body>
          <Card.Title>Client Profile</Card.Title>
          {editMode ? (
            <Form onSubmit={handleEditSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date_of_birth?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.emergency_contact || ''}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" type="submit">Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditMode(false)} className="ms-2">Cancel</Button>
            </Form>
          ) : (
            <>
              <div className="client-details">
                <p><strong>ID:</strong> {client.id}</p>
                <p><strong>Name:</strong> {client.first_name} {client.last_name}</p>
                <p><strong>Email:</strong> {client.email}</p>
                <p><strong>Phone:</strong> {client.phone || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {client.date_of_birth || 'N/A'}</p>
                <p><strong>Address:</strong> {client.address || 'N/A'}</p>
                <p><strong>Gender:</strong> {client.gender || 'N/A'}</p>
                <p><strong>Emergency Contact:</strong> {client.emergency_contact || 'N/A'}</p>
                <p><strong>Registered On:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
              </div>
              <Button variant="outline-primary" onClick={() => setEditMode(true)} className="mb-3">Edit Client</Button>
              <h5>Enrolled Programs</h5>
              {client.programs.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Program ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(client.programs || []).map((program: any) => (
                      <tr key={program.id}>
                        <td>{program.id}</td>
                        <td>{program.name}</td>
                        <td>{program.description || 'No description'}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleUnenroll(program.id)}
                          >
                            Unenroll
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No programs enrolled.</p>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientProfile;