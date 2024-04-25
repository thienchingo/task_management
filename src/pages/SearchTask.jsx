import clsx from "clsx";
import { FcSearch } from "react-icons/fc";
import { HiPencilAlt } from "react-icons/hi";
import { IoTrashBinSharp } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import style from "../App.module.scss";
import { useEffect } from "react";
import {
  deleteTask,
  finishedTask,
  inputSearchEndDate,
  inputSearchName,
  inputSearchStartDate,
  inputSearchTaskType,
  searchTask,
} from "../store/todoTask/action";

function SearchTask() {
  const dispatch = useDispatch();
  const { searchKey, searchResult, error } = useSelector(
    (state) => state.TodoReducer
  );
  const { keyName, keyStartDate, keyEndDate, keyTaskType } = searchKey;
  useEffect(() => {
    dispatch(inputSearchName(""));
    dispatch(inputSearchStartDate(""));
    dispatch(inputSearchEndDate(""));
    dispatch(inputSearchTaskType(undefined));
  }, [dispatch]);
  const options = [
    { value: undefined, label: "" },
    { value: "1", label: "Inprogress" },
    { value: "3", label: "Exprided" },
    { value: "2", label: "Done" },
  ];
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      color: "black",
      paddingLeft: "40px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 4px rgba(0,0,0,.2)",
      width: "85%",
      height: "100%",
      margin: "5px 10px",
      fontFamily: '"Poppins", sans-serif',
      fontSize: "17px",
    }),
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected ? "hotpink" : "white",
    }),
  };
  return (
    <div className={clsx(style.inputField)}>
      <h1>Search Task</h1>
      <input
        type="text"
        onChange={(e) => dispatch(inputSearchName(e.target.value))}
        placeholder="Add your new todo"
        value={keyName}
      />
      <input
        type="date"
        onChange={(e) => dispatch(inputSearchStartDate(e.target.value))}
        placeholder="Start"
        value={keyStartDate}
      />
      <input
        type="date"
        onChange={(e) => dispatch(inputSearchEndDate(e.target.value))}
        placeholder="Deadline"
        value={keyEndDate}
      />
      <Select
        options={options}
        styles={customStyles}
        onChange={(e) => {
          dispatch(inputSearchTaskType(e.value));
        }}
      />
      <button
        className={clsx(style.button_input)}
        onClick={() =>
          dispatch(
            searchTask({
              keyName,
              keyStartDate,
              keyEndDate,
              keyTaskType,
            })
          )
        }
      >
        <FcSearch />
      </button>
      <ul className={clsx(style.todoList)}>
        <span
          style={{ color: "green", display: "inline-block", marginLeft: 7 }}
        >
          {error.successed}
        </span>
        <h2>Results</h2>
        {searchResult &&
          searchResult.map((task) => {
            let styles = {
              backgroundColor:
                Number(task.type) === 1
                  ? "rgba(179, 141, 229, 0.26)"
                  : Number(task.type) === 2
                  ? "rgb(162, 231, 162)"
                  : "rgb(207, 170, 166)",
            };
            return (
              <li style={styles} key={task.id}>
                {task.name}
                <span>
                  <Link>
                    <button onClick={() => dispatch(deleteTask(task.id))}>
                      <IoTrashBinSharp />
                    </button>
                  </Link>
                </span>
                <span>
                  <Link to={`/details/${task.id}`}>
                    <button>
                      <HiPencilAlt />
                    </button>
                  </Link>
                </span>
                <span>
                  <Link>
                    <button onClick={() => dispatch(finishedTask(task.id))}>
                      <TiTickOutline />
                    </button>
                  </Link>
                </span>
              </li>
            );
          })}
        {searchResult && <li>{`You have ${searchResult.length} result!`}</li>}
      </ul>
    </div>
  );
}
export default SearchTask;
