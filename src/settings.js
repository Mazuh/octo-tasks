import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { persistSettings } from './services/settings';

const SettingsForm = props => {
  const shimSubmitEvent = fn => event => {
    event.preventDefault(); 
    fn(event);
  }

  return (
    <Container>
      <Form className="p-3" onSubmit={shimSubmitEvent((e) => console.log(e))} className="mb-4">
        <Form.Group>
          <Row>
            <Form.Label>Promodoro</Form.Label>
            <Form.Control
              id="promodoro"
              name="promodoro"
              className="w-100"
              placeholder="promodoro"
              autoComplete="off"
              required
            />
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
            <Form.Label>Shortbreak</Form.Label>
            <Form.Control
              id="shortbreak"
              name="shortbreak"
              className="w-100"
              placeholder="short break"
              autoComplete="off"
              required
            />
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
            <Form.Label>Longbreak</Form.Label>
            <Form.Control
              id="longbreak"
              name="longbreak"
              className="w-100"
              placeholder="long break"
              autoComplete="off"
              required
            />
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
};


export default (props) => {
  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SettingsForm/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => props.setShow(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
