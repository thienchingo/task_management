import clsx from "clsx";
import { useSelector } from "react-redux";
import style from "../App.module.scss";

function Footer() {
  const { tasks, finalTasks, expridedTask } = useSelector(
    (state) => state.TodoReducer
  );
  return (
    <div className={clsx(style.footer)}>
      <span>
        Total{" "}
        <span className={clsx(style.pendingTasks)}>
          {tasks.length + finalTasks.length + expridedTask.length}
        </span>{" "}
         tasks
      </span>
    </div>
  );
}
export default Footer;
