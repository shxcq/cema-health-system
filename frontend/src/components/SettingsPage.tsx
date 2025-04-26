import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editProgramId, setEditProgramId] = useState<number | null>(null);
  const [editProgramName, setEditProgramName] = useState('');
  const [editProgramDescription, setEditProgramDescription] = useState('');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    fetchPrograms();
    fetchClients();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/programs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(response.data);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch programs.');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch clients.');
    }
  };

  const handleEditProgram = (program: any) => {
    setEditProgramId(program.id);
    setEditProgramName(program.name);
    setEditProgramDescription(program.description || '');
  };

  const handleSaveProgram = async (programId: number) => {
    try {
      await axios.put(
        `http://localhost:5001/api/programs/${programId}`,
        { name: editProgramName, description: editProgramDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrograms(programs.map(program =>
        program.id === programId
          ? { ...program, name: editProgramName, description: editProgramDescription }
          : program
      ));
      setEditProgramId(null);
      setEditProgramName('');
      setEditProgramDescription('');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update program.');
    }
  };

  return (
    <Container className="settings-container">
      <h2 className="page-title">Settings</h2>

      {errorMessage && (
        <Alert variant="warning" className="error-alert">
          {errorMessage}
        </Alert>
      )}

      {/* Manage Programs */}
      <div className="settings-section chart-card">
        <h3 className="section-title">Manage Programs</h3>
        {programs.length > 0 ? (
          <Table className="settings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {programs.map(program => (
                <tr key={program.id}>
                  <td>{program.id}</td>
                  <td>
                    {editProgramId === program.id ? (
                      <Form.Control
                        type="text"
                        value={editProgramName}
                        onChange={(e) => setEditProgramName(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      program.name
                    )}
                  </td>
                  <td>
                    {editProgramId === program.id ? (
                      <Form.Control
                        type="text"
                        value={editProgramDescription}
                        onChange={(e) => setEditProgramDescription(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      program.description || 'No description'
                    )}
                  </td>
                  <td>
                    {editProgramId === program.id ? (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="action-button"
                        onClick={() => handleSaveProgram(program.id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="action-button"
                        onClick={() => handleEditProgram(program)}
                      >
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="no-data-text">No programs found.</p>
        )}
      </div>

      {/* View Clients */}
      <div className="settings-section chart-card">
        <h3 className="section-title">All Clients</h3>
        {clients.length > 0 ? (
          <Table className="settings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.first_name} {client.last_name}</td>
                  <td>{client.email}</td>
                  <td>
                    <Link to={`/clients/${client.id}`}>
                      <Button variant="outline-primary" size="sm" className="action-button">
                        View Profile
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="no-data-text">No clients found.</p>
        )}
      </div>
    </Container>
  );
};

export default SettingsPage;