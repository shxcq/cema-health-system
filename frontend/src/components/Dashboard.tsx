import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, BarElement, CategoryScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, BarElement, CategoryScale);

const Dashboard: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchClients();
      fetchPrograms();
    } else {
      setError('Please log in to view dashboard.');
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
      console.error('Failed to fetch clients:', err.response?.data);
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
      console.error('Failed to fetch programs:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch programs.');
    }
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
      {error && <div className="alert alert-danger">{error}</div>}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="chart-card dashboard-chart">
            <Card.Body>
              <Card.Title>Clients by Gender</Card.Title>
              <Doughnut data={genderData} options={{ maintainAspectRatio: false }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="chart-card dashboard-chart">
            <Card.Body>
              <Card.Title>Clients by Program</Card.Title>
              <Bar data={programData} options={{ maintainAspectRatio: false }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="chart-card dashboard-chart">
            <Card.Body>
              <Card.Title>Registrations Over Time</Card.Title>
              <Line data={registrationData} options={{ maintainAspectRatio: false }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;