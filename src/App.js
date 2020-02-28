import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import ToDo from './services/ToDo';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'read':
      return {
        ...state,
        isLoading: false,
        error: null,
        tasks: action.tasks,
      };
    case 'created':
      return {
        ...state,
        isLoading: false,
        error: null,
        tasks: [...state.tasks, action.task],
      };
    case 'updated':
      return {
        ...state,
        isLoading: false,
        error: null,
        tasks: state.tasks.map(task => task.uuid === action.task.uuid
          ? action.task
          : task
        ),
      };
    case 'deleted':
      return {
        ...state,
        isLoading: false,
        error: null,
        tasks: state.tasks.filter(task => task.uuid !== action.task.uuid),
      };
    case 'error':
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  };
};

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: true,
    tasks: [],
    error: null,
  });

  React.useEffect(() => {
    if (state.error) {
      toast(state.error.message);
    }
  }, [state.error]);

  return (
    <div>
      <AppHeader state={state} dispatch={dispatch} />
      <TaskForm state={state} dispatch={dispatch} />
      <Container>
        {!state.isLoading && state.tasks.length === 0 && (
          <Flash variant="light">No tasks yet.</Flash>
        )}
      </Container>
      <TasksList state={state} dispatch={dispatch} />
      <ToastContainer />
    </div>
  );
};

const AppHeader = ({ state }) => (
  <Container>
    <h1 className="text-center">
      My tasks app
      {state.isLoading && <small> Loading...</small>}
    </h1>
  </Container>
);

const TaskForm = (props) => {
  const [description, setDescription] = React.useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    props.dispatch({ type: 'loading' });

    ToDo.create(description).then((task) => {
      setDescription('');
      props.dispatch({ type: 'created', task });
      toast('Task created!');
    }).catch((error) => {
      props.dispatch({ type: 'error', error });
    });
  };

  return (
    <Container>
      <Form onSubmit={onSubmit} className="mb-4" inline>
        <Row className="w-100">
          <Col md={8} className="ml-auto">
            <Form.Group controlId="formBasicEmail">
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
            </Form.Group>
          </Col>
          <Col md={1} className="mr-auto">
            <Button
              variant="primary"
              type="submit"
              disabled={props.state.isLoading}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const TasksList = ({ dispatch, ...props }) => {
  React.useEffect(() => {
    ToDo.read().then((tasks) => {
      dispatch({ type: 'read', tasks });
    }).catch((error) => {
      dispatch({ type: 'error', error });
    });
  }, [dispatch]);

  const onCheckChangeFn = (task) => (event) => {
    const isDone = event.target.checked;
    patchTask(task, { isDone });
  };

  const onClickDescriptionFn = (task) => () => {
    const foundTask = props.state.tasks.find(it => it.uuid === task.uuid);
    if (!foundTask) {
      return;
    }

    patchTask(task, { isDone: !foundTask.isDone });
  }

  const patchTask = (task, patch) => {
    const updatingTask = { ...task, ...patch };

    dispatch({ type: 'loading' });
    ToDo.update(task.uuid, updatingTask).then((updated) => {
      dispatch({ type: 'updated', task: updated });
    }).catch((error) => {
      dispatch({ type: 'error', error });
    });
  };

  const onClickDelFn = (task) => () => {
    dispatch({ type: 'loading' });
    ToDo.delete(task.uuid).then((deleted) => {
      dispatch({ type: 'deleted', task: deleted });
      toast('Task deleted!');
    }).catch((error) => {
      dispatch({ type: 'error', error });
    });
  };

  return (
    <Container>
      <ListGroup>
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
    </Container>
  );
};

const Flash = (props) => (
  <Alert className="w-50 ml-auto mr-auto mt-4 text-center" {...props} />
);
