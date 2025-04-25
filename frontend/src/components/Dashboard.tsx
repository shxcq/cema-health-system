import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, BarElement, CategoryScale } from 'chart.js';
import { Link } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, BarElement, CategoryScale);

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchClients();
      fetchPrograms();
    }
  }, [token]);

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

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/programs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(response.data);
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients();
  };

  const programCounts = programs.map((program: any) => {
    return {
      name: program.name,
      count: clients.filter((client: any) =>
        client.programs.some((p: any) => p.id === program.id)
      ).length,
    };
  });

  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: [
          clients.filter((client: any) => client.gender === 'Male').length,
          clients.filter((client: any) => client.gender === 'Female').length,
          clients.filter((client: any) => client.gender === 'Other').length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const programData = {
    labels: programCounts.map((pc: any) => pc.name),
    datasets: [
      {
        label: 'Number of Clients',
        data: programCounts.map((pc: any) => pc.count),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const registrationData = {
    labels: Array.from(new Set(clients.map((client: any) => new Date(client.created_at).toLocaleDateString()))),
    datasets: [
      {
        label: 'Client Registrations',
        data: Array.from(new Set(clients.map((client: any) => new Date(client.created_at).toLocaleDateString()))).map(
          (date) => clients.filter((client: any) => new Date(client.created_at).toLocaleDateString() === date).length
        ),
        borderColor: '#FF6384',
        fill: false,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h2>Dashboard</h2>
      <Row className="mb-4">
        <Col md={6}>
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
        <Col md={4}>
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Clients by Gender</Card.Title>
              <Doughnut data={genderData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Clients by Program</Card.Title>
              <Bar data={programData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Registrations Over Time</Card.Title>
              <Line data={registrationData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
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

export default Dashboard;