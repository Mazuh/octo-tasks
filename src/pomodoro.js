import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Push from 'push.js';
import { Howl } from 'howler';

import Settings from './services/settings';
import { useDispatch, useSelector } from 'react-redux';
import {
  setType,
  setTime,
  setRunning,
  setStart,
  setConfig
} from './ducks/PomodoroSlice';

const types = {
  pomodoro: 'Pomodoro',
  shortBreak: 'Short Break',
  longBreak: 'Long Break' 
}

export default function Pomodoro({ type }) {
  const time = useSelector(state => state.pomodoro.time);
  const isRunning = useSelector(state => state.pomodoro.isRunning);
  const start = useSelector(state => state.pomodoro.start);
  const config = useSelector(state => state.pomodoro.config);

  return (
    <div className="pomorodo__wrapper d-flex flex-column p-3 mt-4 rounded mb-4">
      <PomodoroTabs
        time={time}
        isRunning={isRunning}
        start={start}
        type={type}
        config={config}
      />
      <PomodoroClock
        time={time}
        isRunning={isRunning}
        start={start}
        type={type}
        config={config}
      />
      <PomodoroActions
        isRunning={isRunning}
        start={start}
      />
    </div>
  );
}

const PomodoroClock = ({ config, ...props }) => {
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);

  React.useEffect(() => {
    if (props.start === 0) {
      const initialTimestamp = Date.now();
      const end = initialTimestamp + props.time * 60 * 1000;
      setRemainingSeconds((end - Date.now() + 1) / 1000);
    }

    if (!props.isRunning) {
      return;
    }
    const countdown = setTimeout(() => {
      const end = props.start + props.time * 60 * 1000;
      const nextRemainingSeconds = (end - Date.now() + 1) / 1000;
      const sound = new Howl({
        src: config.sound
      })
      if (nextRemainingSeconds >= 0) {
        setRemainingSeconds(nextRemainingSeconds);
      } else {
        sound.play();
        Push.create("Octo-tasks", {
          body: `${types[props.type]} is over!`,
          tag: 'done',
          icon:'',
          timeout: 4000,
          onClick: () => {
            window.focus();
            Push.close();
          }
        });   
      } 
    }, 200);

    return () => clearTimeout(countdown);
  }, [props, remainingSeconds, config.sound]);

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, 0);
  const seconds = String(Math.floor(remainingSeconds % 60)).padStart(2, 0);
  

  React.useEffect(() => {
    document.title = `${minutes}:${seconds} ${types[props.type]}`
  }, [minutes, seconds, props.type])

  return (
    <div className="pomorodo__time d-flex justify-content-center align-items-center flex-grow-1">
      {minutes + ':' + seconds}
    </div>
  );
};

const PomodoroActions = props => {
  const [currentPause, setCurrentPause] = React.useState(0);
  const dispatch = useDispatch();

  const start = () => {
    if (props.start === 0) {
      dispatch(setStart(Date.now()));
    } else {
      dispatch(setStart(props.start + Date.now() - currentPause));
    }
    dispatch(setRunning(true));
  };

  const pause = () => {
    dispatch(setRunning(false));
    setCurrentPause(Date.now());
  };

  const reset = () => {
    dispatch(setStart(0));
    dispatch(setRunning(false));
  };

  return (
    <ButtonToolbar>
      <Button
        className="ml-auto mr-2"
        variant="primary"
        type="button"
        disabled={props.isRunning}
        onClick={start}
      >
        Start
      </Button>
      <Button
        className="ml-2 mr-2"
        variant="danger"
        type="button"
        disabled={!props.isRunning}
        onClick={pause}
      >
        Pause
      </Button>
      <Button
        className="mr-auto ml-2"
        variant="secondary"
        type="button"
        onClick={reset}
      >
        Reset
      </Button>
    </ButtonToolbar>
  );
};

const PomodoroTabs = ({ type, config, ...props }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    Settings.read().then(settings => dispatch(setConfig(settings)));
  }, [dispatch]);

  const setTimerType = type => {
    setTime(config[type]);

    dispatch(setType(type));
    dispatch(setStart(0));
    dispatch(setRunning(false));
  };

  React.useEffect(() => {
    dispatch(setTime(config[type]));
  }, [config, type, dispatch]);

  return (
    <ButtonToolbar className="d-none d-md-flex justify-content-around">
      <Button
        className="mb-3 col-sm-3"
        variant="primary"
        type="button"
        disabled={type === 'pomodoro'}
        onClick={() => {
          setTimerType('pomodoro');
        }}
      >
        Pomodoro
      </Button>
      <Button
        className="mb-3 col-sm-3"
        variant="primary"
        type="button"
        disabled={type === 'shortBreak'}
        onClick={() => {
          setTimerType('shortBreak');
        }}
      >
        Short Break
      </Button>
      <Button
        className="mb-3 col-sm-3"
        variant="primary"
        type="button"
        disabled={type === 'longBreak'}
        onClick={() => {
          setTimerType('longBreak');
        }}
      >
        Long Break
      </Button>
    </ButtonToolbar>
  );
};
