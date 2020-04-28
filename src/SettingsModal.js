import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import get from 'lodash.get';
import Settings from './services/settings';

export default function SettingsModal(props) {
  return (
    <Modal show={props.show} onHide={() => props.setShow(false)} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SettingsForm setConfig={props.setConfig}/>
      </Modal.Body>
    </Modal>
  );
}

const initialErrors = {
  pomodoro: '',
  shortBreak: '',
  longBreak: ''
};

const SettingsForm = ({ setConfig, ...props }) => {
  const [settings, setSettings] = React.useState(null);
  const [errors, setErrors] = React.useState(initialErrors);

  React.useEffect(() => {
    if (settings === null) {
      return;
    }

    const hasError = Object.keys(errors).some(name => errors[name]);
    if (hasError) {
      return;
    }

    Settings.update(settings);
    setConfig(settings);
  }, [setConfig, settings, errors]);

  React.useEffect(() => {
    Settings.read().then(setSettings);
  }, [setSettings]);

  const onTimeChangeFn = name => event => {
    if (name === 'sound') {
      console.log(name, event.target.value)
      setSettings({ ...settings, [name]: event.target.value });
    } else {
      const value = parseInt(event.target.value, 10);
      setSettings({ ...settings, [name]: value });
      if (!event.target.value) {
        setErrors({...errors, [name]: 'This field is required'});
      } else if (value <= 0) {
        setErrors({...errors, [name]: 'Only positive values are allowed'});
      } else if (Number.isNaN(value)) {
        setErrors({...errors, [name]: 'Non-integer values are not allowed'});
      } else {
        setErrors({...errors, [name]: ''});
      }
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
        <Form.Group>
          <Row>
            <Form.Label>Example select</Form.Label>
            <Form.Control
              as="select"
              value={get(settings, 'sound', '/ring.mp3')}
              onChange={onTimeChangeFn('sound')}
            >
              <option value={'/ring.mp3'}>Sound 1</option>
              <option value={'/notification_bell.mp3'}>Sound 2</option>
              <option value='/notification.mp3'>Sound 3</option>
              <option value='/notification_sound.mp3'>Sound 4</option>
              <option value='/notification_sound_1.mp3'>Sound 5</option>
            </Form.Control>
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
};
