import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Navbar,
  Nav,
  Alert,
} from 'react-bootstrap';

interface DashboardProps {
  token: string;
  error: string;
  searchQuery: string;
  clients: any[];
  clientData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
  };
  programData: { name: string; description: string };
  enrollData: { client_id: string; program_id: string };
  setToken: (value: string) => void;
  setError: (value: string) => void;
  setSearchQuery: (value: string) => void;
  setClients: (value: any[]) => void;
  setClientData: (value: any) => void;
  setProgramData: (value: any) => void;
  setEnrollData: (value: any) => void;
  handleSearchClients: () => void;
  handleRegisterClient: (e: React.FormEvent) => void;
  handleCreateProgram: (e: React.FormEvent) => void;
  handleEnrollClient: (e: React.FormEvent) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  token,
  error,
  searchQuery,
  clients,
  clientData,
  programData,
  enrollData,
  setToken,
  setError,
  setSearchQuery,
  setClients,
  setClientData,
  setProgramData,
  setEnrollData,
  handleSearchClients,
  handleRegisterClient,
  handleCreateProgram,
  handleEnrollClient,
}) => (
  <>
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>
          <i className="fas fa-user-md me-2"></i>CEMA Health System
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link onClick={() => setToken('')}>
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    <Container>
      <Row>
        <Col md={3}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Nav className="flex-column">
                <Nav.Link href="#search">
                  <i className="fas fa-search me-2"></i>Search Clients
                </Nav.Link>
                <Nav.Link href="#register">
                  <i className="fas fa-user-plus me-2"></i>Register Client
                </Nav.Link>
                <Nav.Link href="#programs">
                  <i className="fas fa-list me-2"></i>Create Program
                </Nav.Link>
                <Nav.Link href="#enroll">
                  <i className="fas fa-link me-2"></i>Enroll Client
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card className="shadow-sm mb-4" id="search">
            <Card.Body>
              <Card.Title>
                <i className="fas fa-search me-2"></i>Search Clients
              </Card.Title>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchClients()}
                />
              </Form.Group>
              <Button variant="outline-primary" onClick={handleSearchClients}>
                Search
              </Button>
              <ul className="list-group mt-3">
                {clients.map((client: any) => (
                  <li key={client.id} className="list-group-item">
                    {client.first_name} {client.last_name} ({client.email})
                    <Button
                      variant="link"
                      onClick={() =>
                        (window.location.href = `/client/${client.id}`)
                      }
                    >
                      View Profile
                    </Button>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
          <Card className="shadow-sm mb-4" id="register">
            <Card.Body>
              <Card.Title>
                <i className="fas fa-user-plus me-2"></i>Register Client
              </Card.Title>
              <Form onSubmit={handleRegisterClient}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={clientData.first_name}
                        onChange={(e) =>
                          setClientData({
                            ...clientData,
                            first_name: e.target.value,
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={clientData.last_name}
                        onChange={(e) =>
                          setClientData({
                            ...clientData,
                            last_name: e.target.value,
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={clientData.email}
                    onChange={(e) =>
                      setClientData({ ...clientData, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={clientData.phone}
                    onChange={(e) =>
                      setClientData({ ...clientData, phone: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={clientData.date_of_birth}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="btn-hover">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card className="shadow-sm mb-4" id="programs">
            <Card.Body>
              <Card.Title>
                <i className="fas fa-list me-2"></i>Create Program
              </Card.Title>
              <Form onSubmit={handleCreateProgram}>
                <Form.Group className="mb-3">
                  <Form.Label>Program Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={programData.name}
                    onChange={(e) =>
                      setProgramData({ ...programData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={programData.description}
                    onChange={(e) =>
                      setProgramData({
                        ...programData,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="btn-hover">
                  Create
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card className="shadow-sm" id="enroll">
            <Card.Body>
              <Card.Title>
                <i className="fas fa-link me-2"></i>Enroll Client in Program
              </Card.Title>
              <Form onSubmit={handleEnrollClient}>
                <Form.Group className="mb-3">
                  <Form.Label>Client ID</Form.Label>
                  <Form.Control
                    type="number"
                    value={enrollData.client_id}
                    onChange={(e) =>
                      setEnrollData({
                        ...enrollData,
                        client_id: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Program ID</Form.Label>
                  <Form.Control
                    type="number"
                    value={enrollData.program_id}
                    onChange={(e) =>
                      setEnrollData({
                        ...enrollData,
                        program_id: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="btn-hover">
                  Enroll
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </>
);

export default Dashboard;
