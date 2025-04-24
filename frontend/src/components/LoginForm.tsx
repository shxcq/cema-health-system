import React from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

interface LoginFormProps {
  username: string;
  password: string;
  error: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  error,
  setUsername,
  setPassword,
  handleLogin,
}) => (
  <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
    <Card.Body>
      <h3 className="text-center mb-4">
        <i className="fas fa-user-md me-2"></i> CEMA Health System
      </h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>
            <i className="fas fa-user me-2"></i>Username
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>
            <i className="fas fa-lock me-2"></i>Password
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 btn-hover">
          Login
        </Button>
      </Form>
    </Card.Body>
  </Card>
);

export default LoginForm;
