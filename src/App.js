import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import SettingsModal from './SettingsModal';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Pomodoro from './pomodoro.js';
import { useSelector, useDispatch } from 'react-redux';
import { setType, setCompact } from './ducks/PomodoroSlice';
import { tasksActions } from './ducks/TaskResource';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const electron = window.require && window.require('electron');
const remote = window.require && electron.remote;

export default function App() {
  const state = useSelector(state => state.tasks);
  const { compact } = useSelector(state => state.pomodoro);
  const mappedState = {
    ...state,
    tasks: state.items
  };
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (state.error) {
      toast(state.error.message);
    }
  }, [state.error]);
  if (!compact) {
    return (
      <Wrapper>
        <AppHeader
          state={mappedState}
        />
        <Container id="content" className="d-flex flex-column">
          <Pomodoro />
          <TaskForm state={mappedState} dispatch={dispatch} />
          {!mappedState.isLoading && mappedState.tasks.length === 0 && (
            <Flash variant="light">No tasks yet.</Flash>
          )}
          <TasksList state={mappedState} dispatch={dispatch} />
          <ToastContainer />
        </Container>
      </Wrapper>
    );
  }
  else {
    return <Pomodoro />
  }
}

const Wrapper = ({ children }) => {
  const type = useSelector(state => state.pomodoro.type);
  return (
    <div className={`wrapper wrapper--${type}`}>{children}</div>
  );
}

const AppHeader = ({ state }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useDispatch();

  const onClickCompact = () => {
    dispatch(setCompact(true));
    remote.getGlobal("setCompactMode")();
  }
  const onClickTypeFn = type => () => {
    dispatch(setType(type));
  }

  return (
    <Navbar expand="lg" variant="dark">
      <Container>
        <SettingsModal
          setShow={setShow}
          show={show}
        />
        <Navbar.Brand>Octo-tasks</Navbar.Brand>
        <Navbar.Text>
          {state.isLoading ? (
            <small> Loading...</small>
          ) : (
              <Button variant="primary" onClick={() => setShow(true)}>
                Settings
              </Button>
            )
          }
        </Navbar.Text>
        {window.require &&
          <Navbar.Text>
            <Button variant="primary" onClick={onClickCompact}>
              compact mode
          </Button>
          </Navbar.Text>
        }
        <Navbar.Toggle className="d-md-none d-sm-fle" aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-md-none d-sm-flex mr-auto ">
            <Nav.Link onClick={onClickTypeFn('pomodoro')} href="#pomodoro">Pomodoro</Nav.Link>
            <Nav.Link onClick={onClickTypeFn('shortBreak')} href="#shorbreak">Short Break</Nav.Link>
            <Nav.Link onClick={onClickTypeFn('longBreak')} href="#longbreak">Long Break</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const TaskForm = props => {
  const [description, setDescription] = React.useState('');

  const onSubmit = event => {
    event.preventDefault();
    props.dispatch({ type: 'loading' });

    tasksActions
      .create(description)(props.dispatch)
      .then(() => {
        setDescription('');
        toast('Task created!');
      });
  };

  return (
    <div className="mt-3">
      <Form onSubmit={onSubmit} className="mb-4">
        <InputGroup>
          <Form.Control
            name="description"
            className="w-100"
            placeholder="Type a new task description..."
            autoComplete="off"
            value={description}
            onChange={event => setDescription(event.target.value)}
            disabled={props.state.isLoading}
            required
          />
          <InputGroup.Append>
            <Button
              variant="primary"
              type="submit"
              disabled={props.state.isLoading}
            >
              Add
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </div>
  );
};

const TasksList = ({ dispatch, ...props }) => {
  React.useEffect(() => {
    tasksActions.readAll()(dispatch);
  }, [dispatch]);

  const onCheckChangeFn = task => event => {
    const isDone = event.target.checked;
    patchTask(task, { isDone });
  };

  const onClickDescriptionFn = task => () => {
    const foundTask = props.state.tasks.find(it => it.uuid === task.uuid);
    if (!foundTask) {
      return;
    }

    patchTask(task, { isDone: !foundTask.isDone });
  };

  const patchTask = (task, patch) => {
    const updatingTask = { ...task, ...patch };

    tasksActions.update(task.uuid, updatingTask)(dispatch);
  };

  const onClickDelFn = task => () => {
    tasksActions
      .delete(
        task.uuid,
        task
      )(dispatch)
      .then(() => {
        toast('Task deleted!');
      });
  };

  return (
    <ListGroup className="text-dark">
      {props.state.tasks.map(task => (
        <ListGroup.Item key={task.uuid} className="d-flex">
          <Form.Check
            onChange={onCheckChangeFn(task)}
            type="checkbox"
            checked={task.isDone}
            disabled={props.isLoading}
            className="cursor-pointer"
          />
          <span className="cursor-pointer" onClick={onClickDescriptionFn(task)}>
            {task.description}
          </span>
          <Button
            onClick={onClickDelFn(task)}
            variant="danger"
            type="button"
            size="sm"
            className="ml-auto"
            disabled={props.state.isLoading}
          >
            Del
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const Flash = props => (
  <Alert className="w-50 ml-auto mr-auto mt-4 text-center" {...props} />
);
