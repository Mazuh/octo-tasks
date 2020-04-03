import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { persistSettings, retrieveSettings } from './services/settings';

const SettingsForm = props => {
  const shimSubmitEvent = fn => event => {
    event.preventDefault(); 
    fn(event);
  }

  const [settings, updateSettings] = React.useState(retrieveSettings);

  React.useEffect(() => {
    persistSettings(settings);
  }, [settings]);

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
              value={settings.pomodoro}
              onChange={event => updateSettings({...settings, pomodoro: event.target.value})}
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
              value={settings.shortBreak}
              onChange={event => updateSettings({...settings, shortBreak: event.target.value})}
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
              value={settings.longBreak}
              onChange={event => updateSettings({...settings, longBreak: event.target.value})}
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
        </Modal.Footer>
      </Modal>
    </>
  );
};
