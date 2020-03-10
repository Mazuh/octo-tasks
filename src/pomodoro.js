import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Pomodoro() {
  return (
    <div>
        <PomodoroClock Time='25'/>
        <PomodoroActions />
    </div>
  );
}; 

const PomodoroClock = (props) => {
  const [currentTime, setCurrentTime] = React.useState(props.Time*60);
  
  React.useEffect(() => {
    const initialTimeStamp = Date.now();
    const endTimeStamp = initialTimeStamp + props.Time*60*1000;

    const countDown = setInterval(() => {
      setCurrentTime((endTimeStamp - Date.now())/1000)
    }, 200);

    return () => clearInterval(countDown);
  }, [props.Time]);

  const minutes = String(Math.floor(currentTime/60)).padStart(2, 0)
  const seconds = String(Math.floor(currentTime%60)).padStart(2, 0)
  return (
    <Container>
      <h1 className='text-center'>
        {minutes+':'+seconds}
      </h1>
    </Container>
  );
};

const PomodoroActions = () => {
  const [started, setStarted] = React.useState(false);
  const [stoped, setStoped] = React.useState(true);

  const onClick = () => {
    setStoped(!stoped);
    setStarted(!started);
  }

  return (
    <Container>
      <ButtonToolbar>
        <Button
          className='ml-auto mr-2'
          variant='primary'
          type='button'
          disabled={started}
          onClick={onClick}
        >
          Start
        </Button>
        <Button
          className='ml-2 mr-2'
          variant='danger'
          type='button'
          disabled={stoped}
          onClick={onClick}
        >
          Stop
        </Button>
        <Button
          className='mr-auto ml-2'
          variant='secondary'
          type='button'
        >
          Reset
        </Button>
      </ButtonToolbar>
    </Container>
  ); 
};
