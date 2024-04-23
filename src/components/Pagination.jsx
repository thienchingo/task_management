import { Link } from "react-router-dom";
import clsx from "clsx";
import style from "../App.module.scss";
function Pagination({ page, totalPages }) {
  const pagination = [];
  for (let i = 1; i <= totalPages; i++) {
    pagination.push(
      <Link
        key={i}
        to={`/${i}`}
        className={clsx({ [style.active]: i === page })}
      >
        {i}
      </Link>
    );
  }
  return <div>{totalPages !== "" ? pagination : null}</div>;
}
export default Pagination;
