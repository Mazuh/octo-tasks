import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Pomodoro() {
  const [isRunning, setRunning] = React.useState(false);
  const [start, setStart] = React.useState(0);
  const [time, setTime] = React.useState(25);

  return (
    <div>
      <PomodoroTabs
        time={time}
        setTime={setTime}
        isRunning={isRunning}
        setRunning={setRunning}
        start={start}
        setStart={setStart}
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
    <Container>
      <h1 className="text-center">{minutes + ":" + seconds}</h1>
    </Container>
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
    <Container>
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
    </Container>
  );
};

const PomodoroTabs = props => {
  const [type, setType] = React.useState("pomodoro");

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
    <Container>
      <ButtonToolbar>
        <Button
          className="ml-auto mr-2"
          variant="primary"
          type="button"
          disabled={type === "pomodoro"}
          onClick={() => {
            setTimerType("pomodoro");
          }}
        >
          Pomodoro
        </Button>
        <Button
          className="ml-2 mr-2"
          variant="primary"
          type="button"
          disabled={type === "shortBreak"}
          onClick={() => {
            setTimerType("shortBreak");
          }}
        >
          Short Break
        </Button>
        <Button
          className="mr-auto ml-2"
          variant="primary"
          type="button"
          disabled={type === "longBreak"}
          onClick={() => {
            setTimerType("longBreak");
          }}
        >
          Long Break
        </Button>
      </ButtonToolbar>
    </Container>
  );
};
