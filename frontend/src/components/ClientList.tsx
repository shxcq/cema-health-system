import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface ClientListProps {
  clients: any[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  return (
    <>
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
    </>
  );
};

export default ClientList;