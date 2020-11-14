import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import get from 'lodash.get';
import Settings from './services/settings';
import { setConfig } from './ducks/PomodoroSlice';
import { useDispatch } from 'react-redux';

export default function SettingsModal(props) {
  return (
    <Modal show={props.show} onHide={() => props.setShow(false)} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SettingsForm />
      </Modal.Body>
    </Modal>
  );
}

const initialErrors = {
  pomodoro: '',
  shortBreak: '',
  longBreak: ''
};

const SettingsForm = () => {
  const [settings, setSettings] = React.useState(null);
  const [errors, setErrors] = React.useState(initialErrors);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (settings === null) {
      return;
    }

    const hasError = Object.keys(errors).some(name => errors[name]);
    if (hasError) {
      return;
    }

    Settings.update(settings);
    dispatch(setConfig(settings));
  }, [settings, errors, dispatch]);

  React.useEffect(() => {
    Settings.read().then(setSettings);
  }, [setSettings]);

  const onTimeChangeFn = name => event => {
    if (name === 'sound') {
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
            <Form.Label>Notification Sound</Form.Label>
            <Form.Control
              as="select"
              value={get(settings, 'sound', '/assets/notifications-sounds/service-bell_daniel_simion.mp3')}
              onChange={onTimeChangeFn('sound')}
            >
              <option value={'/assets/notifications-sounds/service-bell_daniel_simion.mp3'}>Service Bell Help by Daniel Simion</option>
              <option value={'/assets/notifications-sounds/analog-watch-alarm_daniel-simion.mp3'}>Analog Watch Alarm by Daniel Simion</option>
              <option value={'/assets/notifications-sounds/Blop-Mark_DiAngelo-79054334.mp3'}>Blop by Mark DiAngelo</option>
              <option value={'/assets/notifications-sounds/clock-chimes-daniel_simon.mp3'}>Clock Chimes 4x Sound by Daniel Simion</option>
              <option value={'/assets/notifications-sounds/sms-alert-1-daniel_simon.mp3'}>Text Message Alert 1 by Daniel Simion</option>
              <option value={'/assets/notifications-sounds/sms-alert-5-daniel_simon.mp3'}>Text Message Alert 5 by Daniel Simion</option>
            </Form.Control>
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
};
