import clsx from "clsx";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { AiFillPlusSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import style from "../App.module.scss";
import {
  addTask,
  inputTaskDescription,
  inputTaskEndDate,
  inputTaskName,
  inputTaskStartDate,
  resetMessage,
  viewTask,
} from "../store/todoTask/action";
function DetailTaskPage() {
  const { idTask } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(viewTask(idTask));
  }, [idTask]);
  const { name, description, startDate, endDate, id, error, type } =
    useSelector((state) => state.TodoReducer);
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!isEmpty(error)) dispatch(resetMessage());
    }, 1000);
    return () => clearTimeout(timerId);
  }, [error]);
  return (
    <div className={clsx(style.inputField)}>
      <h1>Detail Task</h1>
      {error && error.successed && (
        <span
          style={{ color: "green", display: "inline-block", marginLeft: 7 }}
        >
          {error.successed}
        </span>
      )}
      {error && error.name && (
        <span style={{ color: "red", display: "inline-block", marginLeft: 7 }}>
          {error.name}
        </span>
      )}
      <input
        type="text"
        onChange={(e) => dispatch(inputTaskName(e.target.value))}
        placeholder="Add your new todo"
        value={name}
        disabled={type && Number(type) === 2}
      />
      <input
        type="text"
        onChange={(e) => dispatch(inputTaskDescription(e.target.value))}
        placeholder="Descripttion"
        value={description}
        disabled={type && Number(type) === 2}
      />
      {error && error.startDate && (
        <span style={{ color: "red", display: "inline-block", marginLeft: 7 }}>
          {error.startDate}
        </span>
      )}
      <input
        type="date"
        onChange={(e) => dispatch(inputTaskStartDate(e.target.value))}
        placeholder="Start"
        value={startDate}
        disabled={type && Number(type) === 2}
      />
      {error && error.endDate && (
        <span style={{ color: "red", display: "inline-block", marginLeft: 7 }}>
          {error.endDate}
        </span>
      )}
      <input
        type="date"
        onChange={(e) => dispatch(inputTaskEndDate(e.target.value))}
        placeholder="Deadline"
        value={endDate}
        disabled={type && Number(type) === 2}
      />
      {type && Number(type) !== 2 && (
        <button
        className={clsx(style.button_input)}
        onClick={() =>
          dispatch(
            addTask({
              name,
              description,
              startDate,
              endDate,
              id,
            })
          )
        }
      >
        <AiFillPlusSquare />
      </button>
      )}

    </div>
  );
}
export default DetailTaskPage;
