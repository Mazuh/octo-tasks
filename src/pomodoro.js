import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Pomodoro() {
  const [started, setStarted] = React.useState(false);
  const [currentPause, setCurrentPause] = React.useState(false);
  const [isRunning, setRunning] = React.useState(false);

  return (
    <div>
        <PomodoroClock
          started={started}
          setStarted={setStarted}
          isRunning={isRunning} 
          setRunning={setRunning}
          currentPause={currentPause} 
          setCurrentPause={setCurrentPause}
          />
        <PomodoroActions
          started={started}
          setStarted={setStarted}
          isRunning={isRunning} 
          setRunning={setRunning}
          currentPause={currentPause} 
          setCurrentPause={setCurrentPause}
        />
    </div>
  );
}; 

const getEndTimestamp = (beginTimestamp, secondsToElapse) => beginTimestamp + secondsToElapse * 60 * 1000;
const getRemainingTimestamp = (endingTimestamp) => endingTimestamp - Date.now();

const PomodoroClock = (props) => {
  const totalSeconds = 25;
  const [remainingSeconds, setRemainingSeconds] = React.useState(totalSeconds * 60);

  React.useEffect(() => {
    if (!props.isRunning) {
      return;
    }

    const countdown = setInterval(() => {
      const ending = getEndTimestamp(props.started, totalSeconds);
      const remaining = getRemainingTimestamp(ending);

      if (props.isRunning) {
        setRemainingSeconds(remaining / 1000);
      }
    }, 200);

    return () => clearInterval(countdown);
  }, [props.started, props.isRunning]);

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
  const start = () => {
    if (!props.started) {
      props.setStarted(Date.now());
    } else if (props.currentPause) {
      props.setStarted(props.currentPause + Date.now()); // fixme
      props.setCurrentPause(false);
    }

    props.setRunning(true);
  };

  const pause = () => {
    props.setCurrentPause(Date.now());
    props.setRunning(false);
  };

  const reset = () => {
    props.setStarted(Date.now());
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
