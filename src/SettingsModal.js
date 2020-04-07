import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import get from 'lodash.get';
import Settings from './services/Settings';

export default function SettingsModal(props) {
  return (
    <Modal show={props.show} onHide={() => props.setShow(false)} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SettingsForm/>
      </Modal.Body>
    </Modal>
  );
}

const SettingsForm = props => {
  const [settings, setSettings] = React.useState(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (settings === null) {
      return;
    }

    // TODO: other validations: negative values, non-integers, too big, etc.
    // and raise toasts instead of saving.
    // (or, a bigger challenge: place a red border for error on the bad input.)
    if (error) {
      return;
    }

    Settings.update(settings);
  }, [settings, error]);

  React.useEffect(() => {
    Settings.read().then(setSettings);
  }, [setSettings]);

  // TODO: create onChange function factory (ie., a function that creates another closure function). =) 
  // hint, the final result should be, on the props:
  // ...
  // onChange={onChangeFn('pomodoro')}
  // ...
  // onChange={onChangeFn('shortBreak')}
  // ...
  // onChange={onChangeFn('longBreak')}

  const onTimeChangeFn = name => event => {
    const value = parseInt(event.target.value, 10);
    setSettings({ ...settings, [name]: value });
    if (value < 0) {
      setError('Negative are not allowed');
    } else {
      setError('');
    }
  };

  return (
    <Container>
      <Form className="p-3 mb-4" onSubmit={e => e.preventDefault()}>
        <Form.Group>
          <Row>
            <Form.Label>Promodoro</Form.Label>
            <Form.Control
              id="pomodoro"
              type="number"
              className="w-100"
              placeholder="pomodoro"
              autoComplete="off"
              value={get(settings, 'pomodoro', '')}
              onChange={onTimeChangeFn('pomodoro')}
            />
            <span>{error}</span>
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
            <Form.Label>Short break</Form.Label>
            <Form.Control
              id="shortbreak"
              type="number"
              className="w-100"
              placeholder="short break"
              autoComplete="off"
              value={get(settings, 'shortBreak', '')}
              onChange={event => setSettings({ ...settings, shortBreak: event.target.value })}
            />
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
            <Form.Label>Long break</Form.Label>
            <Form.Control
              id="longbreak"
              type="number"
              className="w-100"
              placeholder="long break"
              autoComplete="off"
              value={get(settings, 'longBreak', '')}
              onChange={event => setSettings({ ...settings, longBreak: event.target.value })}
            />
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
};
