import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { PencilSquare, Trash, PersonCircle } from 'react-bootstrap-icons';

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

  if (!client) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="client-profile-container">
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}

      {/* Profile Header */}
      <div className="profile-header mb-4">
        <div className="profile-avatar">
          <PersonCircle size={60} />
        </div>
        <div className="profile-header-info">
          <h2 className="profile-name">{client.first_name} {client.last_name}</h2>
          <p className="profile-email">{client.email}</p>
        </div>
      </div>

      <Card className="chart-card client-profile-card">
        <Card.Body>
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
                      className="profile-input"
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
                      className="profile-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="profile-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="profile-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.date_of_birth?.split('T')[0] || ''}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="profile-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={formData.gender || ''}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="profile-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="profile-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.emergency_contact || ''}
                      onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                      className="profile-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" className="profile-button me-2">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setEditMode(false)} className="profile-button">
                Cancel
              </Button>
            </Form>
          ) : (
            <Row>
              {/* Client Details */}
              <Col lg={6} className="mb-4">
                <h5 className="section-title">Personal Information</h5>
                <div className="client-details">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span>{client.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span>{client.phone || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span>{client.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span>{client.address || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span>{client.gender || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Emergency Contact:</span>
                    <span>{client.emergency_contact || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Registered On:</span>
                    <span>{new Date(client.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="outline-primary"
                  onClick={() => setEditMode(true)}
                  className="profile-button mt-3"
                >
                  <PencilSquare className="me-2" /> Edit Client
                </Button>
              </Col>

              {/* Enrolled Programs */}
              <Col lg={6}>
                <h5 className="section-title">Enrolled Programs</h5>
                {client.programs.length > 0 ? (
                  <Table striped bordered hover className="profile-table">
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
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleUnenroll(program.id)}
                              className="action-button"
                            >
                              <Trash className="me-1" /> Unenroll
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="no-data-text">No programs enrolled.</p>
                )}
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientProfile;