import { isEmpty } from "lodash";
import compare, { compareDate, compareDateExprided } from "../../helps/utils";
import {
  ADD_TASK,
  AUTO_CHECK_EXPRIDED_TASK,
  DELETE_TASK,
  FECH_PAGE_DATA,
  FECH_PAGE_DATA_INFINITE,
  FINISHED_TASK,
  INITIAL_STATE,
  INPUT_SEARCH_END_DATE,
  INPUT_SEARCH_NAME,
  INPUT_SEARCH_START_DATE,
  INPUT_SEARCH_TASK_TYPE,
  INPUT_TASK_DESCRIPTION,
  INPUT_TASK_END_DATE,
  INPUT_TASK_NAME,
  INPUT_TASK_START_DATE,
  RESET_MESSAGE,
  SEARCH_TASK,
  SET_ISLOADING,
  VIEW_TASK,
} from "./actionType";
const initialState = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  id: "",
  searchKey: {
    keyName: "",
    keyStartDate: "",
    keyEndDate: "",
  },
  searchResult: [],
  error: {},
  tasks: [],
  finalTasks: [],
  expridedTask: [],
  pageData: [],
  totalPages: "",
  isLoading: false,
  pageId: 1,
};
const TodoReducer = (state = initialState, action) => {
  switch (action.type) {
    case INPUT_TASK_NAME:
      state = {
        ...state,
        name: action.payload,
      };
      return state;
    case INPUT_TASK_DESCRIPTION:
      state = {
        ...state,
        description: action.payload,
      };
      return state;
    case INPUT_TASK_START_DATE:
      state = {
        ...state,
        startDate: action.payload,
      };
      return state;
    case INPUT_TASK_END_DATE:
      state = {
        ...state,
        endDate: action.payload,
      };
      return state;
    case RESET_MESSAGE:
      state = {
        ...state,
        error: {},
      };
      return state;
    case VIEW_TASK:
      let allTask2 = [
        ...state.tasks,
        ...state.finalTasks,
        ...state.expridedTask,
      ];
      let task = allTask2.filter((ts) => ts.id === action.payload);
      if (task.length > 0) {
        state = {
          ...state,
          name: task[0].name,
          description: task[0].description,
          startDate: task[0].startDate,
          endDate: task[0].endDate,
          id: task[0].id,
          type: task[0].type,
        };
      }
      return state;
    case ADD_TASK:
      let error;
      if (action.payload.name === "") {
        error = {
          name: "Task name invalid",
        };
      }
      if (action.payload.startDate === "") {
        error = {
          ...error,
          startDate: "Start date is required",
        };
      }
      if (action.payload.endDate === "") {
        error = {
          ...error,
          endDate: "End date is required",
        };
      }
      if (error !== undefined) return { ...state, error };
      const date1 = new Date(action.payload.startDate);
      const date2 = new Date(action.payload.endDate);
      if (date2.getTime() < date1.getTime()) {
        return {
          ...state,
          error: {
            endDate: "End date cannot less than start date!",
          },
        };
      }
      const task2 = state.tasks.filter((ts) => ts.id !== action.payload.id);
      const exprided = state.expridedTask.filter(
        (ts) => ts.id !== action.payload.id
      );
      if (
        (task2 && task2.length < state.tasks.length) ||
        exprided.length < state.expridedTask.length
      ) {
        const newTasks = [...task2, action.payload];

        state = {
          ...state,
          tasks: newTasks.sort(compare),
          name: action.payload.name,
          description: action.payload.description,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          isLoading: false,
          id: action.payload.id,
          expridedTask: exprided.sort(compare),
          totalPages: Math.ceil(state.tasks.length / 8),
          type: 1,
          error: {
            successed: "Edit task completed!",
          },
        };
        localStorage.setItem("DATA", JSON.stringify({ ...state, error: {} }));
        return state;
      }
      state = {
        ...state,
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        tasks: [...state.tasks, action.payload].sort(compare),
        totalPages: Math.ceil(state.tasks.length / 8),
        type: 1,
        error: {
          successed: "Add task complete!",
        },
      };
      localStorage.setItem("DATA", JSON.stringify({ ...state, error: {} }));
      return state;
    case DELETE_TASK:
      const targetTask = state.tasks.filter((i) => i.id !== action.payload);
      const targetTask2 = state.expridedTask.filter(
        (i) => i.id !== action.payload
      );
      return (state = {
        ...state,
        tasks: targetTask.sort(compare),
        expridedTask: targetTask2.sort(compare),
        error: {
          successed: `You have been deleted task id ${action.payload}!`,
        },
      });
    case FINISHED_TASK:
      const inprogressTask = state.tasks.filter((i) => i.id !== action.payload);
      const finishTask = state.tasks
        .filter((i) => i.id === action.payload)
        .map((ts) => {
          return {
            ...ts,
            type: 2,
          };
        });
      const expridedTasks = state.expridedTask.filter(
        (i) => i.id !== action.payload
      );
      const expridedFnTasks = state.expridedTask
        .filter((i) => i.id === action.payload)
        .map((ts) => {
          return {
            ...ts,
            type: 2,
          };
        });
      state = {
        ...state,
        tasks: inprogressTask.sort(compare),
        expridedTask: expridedTasks.sort(compare),
        finalTasks: [
          ...state.finalTasks,
          ...finishTask,
          ...expridedFnTasks,
        ].sort(compare),
        error: {
          successed: `Task id ${action.payload} had been finished!`,
        },
      };
      localStorage.setItem("DATA", JSON.stringify({ ...state, error: {} }));
      return state;
    case AUTO_CHECK_EXPRIDED_TASK:
      const currentDate = new Date();
      const listExpridedTask = state.tasks
        .filter((ts) => compareDateExprided(currentDate, ts))
        .map((ts) => {
          return {
            ...ts,
            type: 3,
          };
        });
      const currentTasks = state.tasks.filter(
        (ts) => !compareDateExprided(currentDate, ts)
      );
      if (!isEmpty(listExpridedTask)) {
        state = {
          ...state,
          tasks: currentTasks.sort(compare),
          expridedTask: [...listExpridedTask],
        };
      }
      localStorage.setItem("DATA", JSON.stringify({ ...state, error: {} }));
      return state;
    case INPUT_SEARCH_NAME:
      const newKeySearch1 = {
        ...state.searchKey,
        keyName: action.payload,
      };
      state = {
        ...state,
        searchKey: newKeySearch1,
      };
      return state;
    case INPUT_SEARCH_START_DATE:
      const newKeySearch2 = {
        ...state.searchKey,
        keyStartDate: action.payload,
      };
      state = {
        ...state,
        searchKey: newKeySearch2,
      };
      return state;
    case INPUT_SEARCH_END_DATE:
      const newKeySearch3 = {
        ...state.searchKey,
        keyEndDate: action.payload,
      };
      state = {
        ...state,
        searchKey: newKeySearch3,
      };
      return state;
    case INPUT_SEARCH_TASK_TYPE:
      const newKeySearch4 = {
        ...state.searchKey,
        keyTaskType: action.payload,
      };
      state = {
        ...state,
        searchKey: newKeySearch4,
      };
      return state;
    case SEARCH_TASK:
      let allTask = [
        ...state.tasks,
        ...state.finalTasks,
        ...state.expridedTask,
      ];

      if (action.payload.keyName !== "") {
        allTask = allTask.filter((ts) => ts.name === action.payload.keyName);
      }
      if (action.payload.keyStartDate !== "") {
        allTask = allTask.filter((ts) =>
          compareDate(ts.startDate, action.payload.keyStartDate)
        );
      }
      if (action.payload.keyEndDate !== "") {
        allTask = allTask.filter((ts) =>
          compareDate(action.payload.keyEndDate, ts.endDate)
        );
      }
      if (action.payload.keyTaskType !== undefined) {
        allTask = allTask.filter(
          (ts) => Number(ts.type) === Number(action.payload.keyTaskType)
        );
      }
      state = {
        ...state,
        searchResult: allTask,
      };
      return state;
    case FECH_PAGE_DATA:
      let pageDatas = [];
      if (Number(action.payload) === 1) {
        state.tasks.forEach((ts, index) => {
          if (index < 8) pageDatas.push(ts);
        });
      } else {
        state.tasks.forEach((ts, index) => {
          if (
            index < 8 * Number(action.payload) &&
            index >= 8 * (Number(action.payload) - 1)
          ) {
            pageDatas.push(ts);
          }
        });
      }
      if (pageDatas) {
        state = {
          ...state,
          pageData: pageDatas,
          pageId: Number(action.payload),
          totalPages: Math.ceil(state.tasks.length / 8),
        };
      }
      return state;
    case FECH_PAGE_DATA_INFINITE:
      let pageDataInfinites = [];
      let pageId =
        state.pageId + 1 <= Math.ceil(state.tasks.length / 8)
          ? state.pageId + 1
          : state.pageId;
      if (Number(pageId) === 1) {
        state.tasks.forEach((ts, index) => {
          if (index < 8) pageDataInfinites.push(ts);
        });
      } else {
        state.tasks.forEach((ts, index) => {
          if (index < 8 * Number(pageId) && index >= 8 * (Number(pageId) - 1)) {
            pageDataInfinites.push(ts);
          }
        });
      }
      if (pageDataInfinites) {
        state = {
          ...state,
          pageData: pageDataInfinites,
          isLoading: true,
          totalPages: Math.ceil(state.tasks.length / 8),
          pageId:
            state.pageId + 1 <= Math.ceil(state.tasks.length / 8)
              ? state.pageId + 1
              : state.pageId,
        };
      }
      localStorage.setItem("DATA", JSON.stringify({ ...state, error: {} }));
      return state;
    case SET_ISLOADING:
      return {
        ...state,
        isLoading: Boolean(action.payload),
      };
    case INITIAL_STATE:
      const initState = JSON.parse(localStorage.getItem("DATA"));
      if (initState) {
        state = initState;
      }
      return state;
    default:
      return (state = { ...state });
  }
};
export default TodoReducer;
