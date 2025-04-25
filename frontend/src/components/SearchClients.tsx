import React from 'react';
import { Col, Form, Button } from 'react-bootstrap';

interface SearchClientsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchClients: React.FC<SearchClientsProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <Col md={4}>
      <Form onSubmit={onSearch}>
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
  );
};

export default SearchClients;