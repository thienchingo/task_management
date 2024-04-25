import clsx from "clsx";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { IoTrashBinSharp } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import style from "../App.module.scss";
import Pagination from "../components/Pagination";
import {
  autoCheckExpridedTask,
  deleteTask,
  fetchInitialState,
  fetchPageData,
  fetchPageDataInfinite,
  finishedTask,
  resetMessage,
  setIsLoading,
} from "../store/todoTask/action";
function DashBoad() {
  const dispatch = useDispatch();
  const {
    tasks,
    error,
    finalTasks,
    expridedTask,
    totalPages,
    isLoading,
    pageData,
    pageId,
  } = useSelector((state) => state.TodoReducer);
  const { page } = useParams();
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!isEmpty(error)) {
        dispatch(resetMessage());
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [tasks, error, dispatch]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (isLoading) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(setIsLoading(false));
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [pageData]);
  useEffect(() => {
    dispatch(fetchInitialState());
  }, []);
  useEffect(() => {
    dispatch(autoCheckExpridedTask());
  }, [tasks, dispatch]);

  useEffect(() => {
    dispatch(fetchPageData(page));
  }, [page, dispatch, error]);
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(setIsLoading(true));
    dispatch(fetchPageDataInfinite());
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);
  return (
    <div>
      <ul className={clsx(style.todoList)}>
        <span
          style={{ color: "green", display: "inline-block", marginLeft: 7 }}
        >
          {error.successed}
        </span>
        <h2>Inprogress task</h2>
        {!isLoading &&
          pageData &&
          pageData.map((task) => {
            return (
              <li
                style={{ backgroundColor: "rgb(179 141 229 / 26%)" }}
                key={task.id}
              >
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
        {isLoading && <p>Loading...</p>}
        <Pagination
          page={Number(page) === Number(pageId) ? Number(page) : Number(pageId)}
          totalPages={totalPages}
        />
        {tasks && <li>{`You have ${tasks.length} inprogress task!`}</li>}
        <hr />
        <ul className={clsx(style.todoList)}>
          <h2>Completed task:</h2>
          {finalTasks &&
            finalTasks.map((task) => {
              return (
                <li style={{ backgroundColor: "#a2e7a2" }} key={task.id}>
                  {task.name}
                  <span>
                    <Link to={`/details/${task.id}`}>
                      <button>
                        <HiPencilAlt />
                      </button>
                    </Link>
                  </span>
                </li>
              );
            })}
          {finalTasks && (
            <li>{`You have ${finalTasks.length} completed task!`}</li>
          )}
          <hr />
          <h2>Exprided Task:</h2>
          {expridedTask &&
            expridedTask.map((task) => {
              return (
                <li style={{ backgroundColor: "#cfaaa6" }} key={task.id}>
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
          {expridedTask && (
            <li>{`You have ${expridedTask.length} exprided task!`}</li>
          )}
        </ul>
      </ul>
    </div>
  );
}
export default DashBoad;
