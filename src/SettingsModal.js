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

const initialErrors = {
  pomodoro: '',
  shortBreak: '',
  longBreak: ''
};

const SettingsForm = props => {
  const [settings, setSettings] = React.useState(null);
  const [errors, setErrors] = React.useState(initialErrors);

  React.useEffect(() => {
    if (settings === null) {
      return;
    }

    // TODO: other validations: negative values, non-integers, too big, etc.
    // and raise toasts instead of saving.
    // (or, a bigger challenge: place a red border for error on the bad input.)
    const hasError = Object.keys(errors).some(name => errors[name]);
    if (hasError) {
      return;
    }

    Settings.update(settings);
  }, [settings, errors]);

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
    if (!event.target.value) {
      setErrors({...errors, [name]: 'This field is required'});
    } else if (value < 0) {
      setErrors({...errors, [name]: 'Negative value are not allowed'});
    } else if (Number.isNaN(value)) {
      setErrors({...errors, [name]: 'Non-integer values are not allowed'});
    } else {
      setErrors({...errors, [name]: ''});
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
            <span className="text-danger">{errors.pomodoro}</span>
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
              onChange={onTimeChangeFn('shortBreak')}
            />
            <span className="text-danger">{errors.shortBreak}</span>
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
              onChange={onTimeChangeFn('longBreak')}
            />
            <span className="text-danger">{errors.longBreak}</span>
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
};
