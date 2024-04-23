import clsx from "clsx";
import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import style from "./App.module.scss";
import Footer from "./components/Footer";
import Dashboad from "./pages/DashBoad";
import DetailTaskPage from "./pages/DetailTaskPage";
import InputTask from "./pages/InputTask";
import SearchTask from "./pages/SearchTask";
function App() {
  const [isActive, setIsActive] = useState(1);
  const handleOnClick = (index) => {
    setIsActive(index);
  };
  return (
    <div className={style.wrapper}>
      <header>Task Management</header>
      <nav>
        <ul>
          <li>
            <Link
              onClick={() => handleOnClick(1)}
              className={clsx({ [style.active]: 1 === isActive })}
              to="/1"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleOnClick(2)}
              className={clsx({ [style.active]: 2 === isActive })}
              to="/search"
            >
              Search Task
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleOnClick(3)}
              className={clsx({ [style.active]: 3 === isActive })}
              to="/input-task"
            >
              NewTask
            </Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/:page" element={<Dashboad />} />
        <Route path="/search" element={<SearchTask />} />
        <Route path="/details/:idTask" element={<DetailTaskPage />} />
        <Route path="/input-task" element={<InputTask />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default React.memo(App);
