export default function compare(a, b) {
  if (a.id < b.id) {
    return 1;
  }
  if (a.id > b.id) {
    return -1;
  }
  return 0;
}
export function compareDateExprided(currentDate, obj) {
  if (currentDate.getTime() > new Date(obj.endDate).getTime()) {
    return true;
  }
  return false;
}
export function compareDate(date1, date2) {
  const obj1 = new Date(date1).getTime();
  const obj2 = new Date(date2).getTime();
  return obj1 >= obj2;
}

export function pagination1(page, index) {
  return index < 10 * page && 10 * (page - 1) >= index;
}
