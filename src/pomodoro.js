import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Pomodoro() {
  const [isRunning, setRunning] = React.useState(false);
  const [start, setStart] = React.useState(0);
  return (
    <div>
        <PomodoroClock
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
};

const PomodoroClock = (props) => {
  const time = 25;
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);

  React.useEffect(() => {
    if (props.start === 0) {
      const initialTimestamp = Date.now();
      const end = initialTimestamp + time * 60 * 1000;
      setRemainingSeconds((end - Date.now() + 1)/1000);
    }
    if (!props.isRunning) {
      return;
    }
    const countdown = setInterval(() => {
      const end = props.start + time * 60 * 1000;
      setRemainingSeconds((end - Date.now())/1000);
    }, 200);

    return () => clearInterval(countdown);
  }, [props]);

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, 0);
  const seconds = String(Math.floor(remainingSeconds % 60)).padStart(2, 0);
  return (
    <Container>
      <h1 className='text-center'>
        {minutes+':'+seconds}
      </h1>
    </Container>
  );
};

const PomodoroActions = (props) => {
  const [currentPause, setCurrentPause] = React.useState(0);

  const start = () => {
    if (props.start === 0) {
      props.setStart(Date.now());
    } else {
      props.setStart(props.start + Date.now() - currentPause);
    }
    props.setRunning(true)
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
          className='ml-auto mr-2'
          variant='primary'
          type='button'
          disabled={props.isRunning}
          onClick={start}
        >
          Start
        </Button>
        <Button
          className='ml-2 mr-2'
          variant='danger'
          type='button'
          disabled = {!props.isRunning}
          onClick={pause}
        >
          Pause
        </Button>
        <Button
          className='mr-auto ml-2'
          variant='secondary'
          type='button'
          onClick={reset}
        >
          Reset
        </Button>
      </ButtonToolbar>
    </Container>
  ); 
};
