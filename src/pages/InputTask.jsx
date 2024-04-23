import style from "../App.module.scss";
import clsx from "clsx";
import { AiFillPlusSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  inputTaskDescription,
  inputTaskEndDate,
  inputTaskName,
  inputTaskStartDate,
  resetMessage,
} from "../store/todoTask/action";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { isEmpty } from "lodash";
function InputTask() {
  const dispatch = useDispatch();
  const { name, description, startDate, endDate, error } = useSelector(
    (state) => state.TodoReducer
  );
  useEffect(() => {
    dispatch(inputTaskName(""));
    dispatch(inputTaskDescription(""));
    dispatch(inputTaskStartDate(""));
    dispatch(inputTaskEndDate(""));
  }, [dispatch]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!isEmpty(error)) dispatch(resetMessage());
    }, 1000);
    return () => clearTimeout(timerId);
  }, [dispatch, error]);
  return (
    <div className={clsx(style.inputField)}>
      <h1>Input task</h1>
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
      />
      <input
        type="text"
        onChange={(e) => dispatch(inputTaskDescription(e.target.value))}
        placeholder="Descripttion"
        value={description}
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
      />
      <button
        className={clsx(style.button_input)}
        onClick={() =>
          dispatch(
            addTask({
              name,
              description,
              startDate,
              endDate,
              type: 1,
              id: uuidv4(),
            })
          )
        }
      >
        <AiFillPlusSquare />
      </button>
    </div>
  );
}
export default InputTask;
