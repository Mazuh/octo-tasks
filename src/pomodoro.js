import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

export default function Pomodoro({ type, setType }) {
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
      />
      <PomodoroClock
        time={time}
        setTime={setTime}
        isRunning={isRunning}
        setRunning={setRunning}
        start={start}
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
    if (remainingSeconds < 0) {
      setRemainingSeconds(0);
      return;
    }
    if (!props.isRunning) {
      return;
    }
    const countdown = setTimeout(() => {
      const end = props.start + props.time * 60 * 1000;
      setRemainingSeconds((end - Date.now()) / 1000);
    }, 200);

    return () => clearTimeout(countdown);
  }, [props, remainingSeconds]);

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, 0);
  const seconds = String(Math.floor(remainingSeconds % 60)).padStart(2, 0);
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

const PomodoroTabs = ({ type, setType, ...props }) => {
  const timers = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10
  };

  const setTimerType = type => {
    props.setTime(timers[type]);

    setType(type);
    props.setStart(0);
    props.setRunning(false);
  };

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
