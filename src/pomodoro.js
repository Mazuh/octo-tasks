import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Push from 'push.js';
import { Howl, Howler } from 'howler';

import Settings from './services/Settings';

const types = {
  pomodoro: 'Pomodoro',
  shortBreak: 'Short Break',
  longBreak: 'Long Break' 
}
const Sound = new Howl({
  src: ["/ring.mp3"]
})

export default function Pomodoro({ type, setType, timers, setTimers }) {
  const [isRunning, setRunning] = React.useState(false);
  const [start, setStart] = React.useState(0);
  const [time, setTime] = React.useState(25);

  return (
    <div className="pomorodo__wrapper d-flex flex-column p-3 mt-4 rounded mb-4">
      <PomodoroTabs
        time={time}
        setTime={setTime}
        isRunning={isRunning}
        setRunning={setRunning}
        start={start}
        setStart={setStart}
        type={type}
        setType={setType}
        timers={timers}
        setTimers={setTimers}
      />
      <PomodoroClock
        time={time}
        setTime={setTime}
        isRunning={isRunning}
        setRunning={setRunning}
        start={start}
        type={type}
        setStart={setStart}
      />
      <PomodoroActions
        isRunning={isRunning}
        setRunning={setRunning}
        start={start}
        setStart={setStart}
      />
    </div>
  );
}

const PomodoroClock = props => {
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
      if (nextRemainingSeconds >= 0) {
        setRemainingSeconds(nextRemainingSeconds);
      } else {
        Sound.play();
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
  }, [props, remainingSeconds]);

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

  const start = () => {
    if (props.start === 0) {
      props.setStart(Date.now());
    } else {
      props.setStart(props.start + Date.now() - currentPause);
    }
    props.setRunning(true);
  };

  const pause = () => {
    props.setRunning(false);
    setCurrentPause(Date.now());
  };

  const reset = () => {
    props.setStart(0);
    props.setRunning(false);
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

const PomodoroTabs = ({ type, setTime, timers, setTimers, ...props }) => {

  React.useEffect(() => {
    Settings.read().then(setTimers);
  }, [setTimers]);

  const setTimerType = type => {
    setTime(timers[type]);

    props.setType(type);
    props.setStart(0);
    props.setRunning(false);
  };

  React.useEffect(() => {
    setTime(timers[type]);
  }, [timers, type, setTime]);

  return (
    <ButtonToolbar>
      <Button
        className="ml-auto mr-2"
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
        className="ml-2 mr-2"
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
        className="mr-auto ml-2"
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
