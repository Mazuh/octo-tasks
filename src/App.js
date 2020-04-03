import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Settings from './settings';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { makeReduxAssets } from 'resource-toolkit';
import Alert from 'react-bootstrap/Alert';
import ToDo from './services/ToDo';
import Pomodoro from './pomodoro.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const tasksResource = makeReduxAssets({
  name: 'tasks',
  idKey: 'uuid',
  gateway: {
    create: description => {
      return ToDo.create(description);
    },
    readMany: () => {
      return ToDo.read();
    },
    update: task => {
      return ToDo.update(task.uuid, task);
    },
    delete: task => {
      return ToDo.delete(task.uuid);
    }
  }
});

export default function App() {
  const [type, setType] = React.useState('pomodoro');
  const [state, dispatch] = React.useReducer(
    tasksResource.reducer,
    tasksResource.initialState
  );
  const mappedState = {
    ...state,
    tasks: state.items
  };

  React.useEffect(() => {
    if (state.error) {
      toast(state.error.message);
    }
  }, [state.error]);

  return (
    <Wrapper type={type}>
      <AppHeader state={mappedState} dispatch={dispatch} />
      <Settings />
      <Container id="content" className="d-flex flex-column">
        <Pomodoro type={type} setType={setType} />
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

const Wrapper = ({ children, type }) => (
  <div className={`wrapper wrapper--${type}`}>{children}</div>
);

const AppHeader = ({ state }) => {
  const [show, setShow] = React.useState(false);

  return (
    <Navbar expand="lg" variant="dark">
      <Container>
          <Settings
            setShow={setShow}
            show={show}
          />
        <Navbar.Brand>My tasks app</Navbar.Brand>
        <Navbar.Text>
          {state.isLoading ? (
            <small> Loading...</small>
            ) : (
            <Button variant="primary" onClick={() => setShow(true)}>
              Config
            </Button>
            )
          }
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

const TaskForm = props => {
  const [description, setDescription] = React.useState('');

  const onSubmit = event => {
    event.preventDefault();
    props.dispatch({ type: 'loading' });

    tasksResource.actions
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
    tasksResource.actions.readAll()(dispatch);
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

    tasksResource.actions.update(task.uuid, updatingTask)(dispatch);
  };

  const onClickDelFn = task => () => {
    tasksResource.actions
      .delete(task.uuid, task)(dispatch)
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
