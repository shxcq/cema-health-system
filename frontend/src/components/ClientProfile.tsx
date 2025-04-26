import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert, ListGroup } from 'react-bootstrap';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth?: string;
    address: string;
    gender: string;
    emergency_contact: string;
  }>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    gender: '',
    emergency_contact: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClient(response.data);
        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          phone: response.data.phone || '',
          date_of_birth: response.data.date_of_birth || '',
          address: response.data.address || '',
          gender: response.data.gender || '',
          emergency_contact: response.data.emergency_contact || '',
        });
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch client.');
      }
    };
    fetchClient();
  }, [id, token]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      gender: formData.gender,
      emergency_contact: formData.emergency_contact,
    };
    if (formData.date_of_birth) {
      payload.date_of_birth = formData.date_of_birth;
    }
    try {
      await axios.put(`http://localhost:5001/api/clients/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Client updated successfully!');
      setError('');
      setEditMode(false);
      const response = await axios.get(`http://localhost:5001/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update client.');
      setSuccess('');
    }
  };

  const handleUnenroll = async (programId: number) => {
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
      setSuccess('');
    }
  };

  if (!client) {
    return <Container className="mt-4"><Alert variant="danger">{error || 'Loading...'}</Alert></Container>;
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="chart-card">
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={formData.gender}
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
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" type="submit">Save Changes</Button>
              <Button variant="secondary" className="ms-2" onClick={() => setEditMode(false)}>Cancel</Button>
            </Form>
          ) : (
            <>
              <p><strong>First Name:</strong> {client.first_name}</p>
              <p><strong>Last Name:</strong> {client.last_name}</p>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phone || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {client.date_of_birth || 'N/A'}</p>
              <p><strong>Address:</strong> {client.address || 'N/A'}</p>
              <p><strong>Gender:</strong> {client.gender || 'N/A'}</p>
              <p><strong>Emergency Contact:</strong> {client.emergency_contact || 'N/A'}</p>
              <h5>Enrolled Programs</h5>
              <ListGroup>
                {client.programs && client.programs.length > 0 ? (
                  client.programs.map((program: any) => (
                    <ListGroup.Item key={program.id}>
                      {program.name}
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleUnenroll(program.id)}
                      >
                        Unenroll
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No programs enrolled</ListGroup.Item>
                )}
              </ListGroup>
              <Button className="mt-3" onClick={() => setEditMode(true)}>Edit Profile</Button>
            </>
          )}
        </Card.Body>
      </Card>
      <Button className="mt-3" variant="secondary" onClick={() => navigate('/clients')}>
        Back to Clients
      </Button>
    </Container>
  );
};

export default ClientProfile;