import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  BarElement,
  CategoryScale,
  Title,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, BarElement, CategoryScale, Title);

// Interfaces
interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string | null;
  created_at: string;
  programs: { id: string; name: string }[];
}

interface Program {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface ProgramCount {
  name: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientError, setClientError] = useState<string>('');
  const [programError, setProgramError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Fetch data on mount
  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setClientError('Please log in to view the dashboard.');
      setProgramError('Please log in to view the dashboard.');
      setLoading(false);
    }
  }, [token]);

  // Fetch clients and programs
  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsResponse, programsResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5001/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Validate response data
      const clientsData = Array.isArray(clientsResponse.data) ? clientsResponse.data : [];
      const programsData = Array.isArray(programsResponse.data) ? programsResponse.data : [];

      setClients(clientsData);
      setPrograms(programsData);
      setClientError('');
      setProgramError('');
    } catch (err: any) {
      console.error('Failed to fetch data:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to load data.';
      if (err.config.url.includes('/clients')) {
        setClientError(errorMessage);
        setClients([]);
      } else {
        setProgramError(errorMessage);
        setPrograms([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Memoized program counts
  const programCounts = useMemo<ProgramCount[]>(() => {
    return programs.map((program) => ({
      name: program.name,
      count: clients.filter((client) => client.programs.some((p) => p.id === program.id)).length,
    }));
  }, [clients, programs]);

  // Memoized registration data
  const registrationData = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(clients.map((client) => new Date(client.created_at).toLocaleDateString()))
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return {
      labels: uniqueDates,
      datasets: [
        {
          label: 'Client Registrations',
          data: uniqueDates.map(
            (date) =>
              clients.filter((client) => new Date(client.created_at).toLocaleDateString() === date)
                .length
          ),
          borderColor: '#FF6384',
          backgroundColor: '#FF6384',
          fill: false,
          tension: 0.1,
        },
      ],
    };
  }, [clients]);

  // Gender chart data
  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: [
          clients.filter((client) => client.gender === 'Male').length,
          clients.filter((client) => client.gender === 'Female').length,
          clients.filter((client) => client.gender === 'Other').length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
        borderWidth: 1,
      },
    ],
  };

  // Program chart data
  const programData = {
    labels: programCounts.map((pc) => pc.name),
    datasets: [
      {
        label: 'Number of Clients',
        data: programCounts.map((pc) => pc.count),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuad' as const,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#333',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
  };

  // Greeting function
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Loading state
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading dashboard...</p>
      </Container>
    );
  }

  // Empty state
  if (!clients.length && !programs.length && !clientError && !programError) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          No clients or programs available. Please register clients or create programs.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">{getGreeting()}, welcome back!</h2>
      {(clientError || programError) && (
        <Alert variant="danger">{clientError || programError}</Alert>
      )}

      {/* KPI Cards */}
      <Row className="mb-4 g-4">
        <Col md={3} xs={12}>
          <Card className="text-center shadow-sm border-primary">
            <Card.Body>
              <h6>Total Clients</h6>
              <h2>{clients.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={12}>
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <h6>Total Programs</h6>
              <h2>{programs.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={12}>
          <Card className="text-center shadow-sm border-warning">
            <Card.Body>
              <h6>New Clients (30d)</h6>
              <h2>
                {
                  clients.filter(
                    (c) => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={12}>
          <Card className="text-center shadow-sm border-info">
            <Card.Body>
              <h6>Active Programs</h6>
              <h2>
                {programs.filter((p) => clients.some((c) => c.programs.some((cp) => cp.id === p.id)))
                  .length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4">
        <Col md={4} xs={12}>
          <Card className="chart-card dashboard-chart shadow-sm border-light">
            <Card.Body>
              <Card.Title>Clients by Gender</Card.Title>
              {clients.length && !clientError ? (
                <div style={{ height: '250px' }}>
                  <Doughnut
                    data={genderData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { display: true, text: 'Gender Distribution' } },
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted">No client gender data available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} xs={12}>
          <Card className="chart-card dashboard-chart shadow-sm border-light">
            <Card.Body>
              <Card.Title>Clients by Program</Card.Title>
              {programs.length && !programError ? (
                <div style={{ height: '250px' }}>
                  <Bar
                    data={programData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { display: true, text: 'Program Enrollment' } },
                      scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Number of Clients' } },
                        x: { title: { display: true, text: 'Programs' } },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted">No program data available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} xs={12}>
          <Card className="chart-card dashboard-chart shadow-sm border-light">
            <Card.Body>
              <Card.Title>Registrations Over Time</Card.Title>
              {clients.length && !clientError ? (
                <div style={{ height: '250px' }}>
                  <Line
                    data={registrationData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { display: true, text: 'Registration Trend' } },
                      scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Registrations' } },
                        x: { title: { display: true, text: 'Date' } },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted">No registration data available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Clients */}
      <Row className="mt-5">
        <Col xs={12}>
          <Card className="chart-card shadow-sm border-light">
            <Card.Body>
              <Card.Title>Recent Clients</Card.Title>
              {clients.length && !clientError ? (
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 5)
                      .map((client) => (
                        <tr key={client.id}>
                          <td>{client.first_name} {client.last_name}</td>
                          <td>{client.email}</td>
                          <td>{new Date(client.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No recent clients available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;