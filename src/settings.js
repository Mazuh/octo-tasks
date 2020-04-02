import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { persistSettings } from './services/settings';

const SettingsForm = props => {
  const shimSubmitEvent = fn => event => {
    event.preventDefault(); 
    fn(event);
  }

  return (
      <Form onSubmit={shimSubmitEvent((e) => console.log(e))} className="mb-4">
        <InputGroup>
          <label htmlFor="promodoro">Promodoro</label>
          <Form.Control
            id="promodoro"
            name="promodoro"
            className="w-100"
            placeholder="promodoro"
            autoComplete="off"
            required
          />
          <label htmlForm="shortbreak">Shortbreak</label>
          <Form.Control
            id="shortbreak"
            name="shortbreak"
            className="w-100"
            placeholder="short break"
            autoComplete="off"
            required
          />
          <label htmlForm="longbreak">Longbreak</label>
          <Form.Control
            id="longbreak"
            name="longbreak"
            className="w-100"
            placeholder="long break"
            autoComplete="off"
            required
          />
        </InputGroup>
      </Form>
  );
};


export default () => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SettingsForm/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
