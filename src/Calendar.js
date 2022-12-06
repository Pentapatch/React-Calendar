import classNames from "classnames";
import "./style.css";
import { useRef, useState } from "react";

// Configuration
let rowLetters = ["a", "b", "c", "d", "e", "f"];
let dayNames = ["må", "ti", "on", "to", "fr", "lö", "sö"];
let monthNames = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

function Row(props) {
  return (
    <tr id={`calendar-row-${props.rowIndex}`}>
      <Cell rowIndex={props.rowIndex} index={1} date={props.date} />
      <Cell rowIndex={props.rowIndex} index={2} date={props.date} />
      <Cell rowIndex={props.rowIndex} index={3} date={props.date} />
      <Cell rowIndex={props.rowIndex} index={4} date={props.date} />
      <Cell rowIndex={props.rowIndex} index={5} date={props.date} />
      <Cell rowIndex={props.rowIndex} index={6} date={props.date} />
      <Cell rowIndex={props.rowIndex} index={7} date={props.date} />
    </tr>
  );
}

function Headers() {
  return (
    <tr className={"calendar-headers"}>
      <Header index={0} />
      <Header index={1} />
      <Header index={2} />
      <Header index={3} />
      <Header index={4} />
      <Header index={5} />
      <Header index={6} />
    </tr>
  );
}

function Header(props) {
  return (
    <td id={`calendar-header-${dayNames[props.index]}`}>
      {dayNames[props.index]}
    </td>
  );
}

function Navigation(props) {
  return (
    <tr className="calendar-nav">
      <td id="calendar-month" colSpan={4}>
        {monthNames[props.date.getMonth()] + " " + props.date.getFullYear()}
      </td>
      <td id="calendar-reset" onClick={props.onResetClick}>
        <span class="material-symbols-outlined">restart_alt</span>
      </td>
      <td id="calendar-prev" onClick={props.onPrevClick}>
        <span className="material-symbols-outlined">chevron_left</span>
      </td>
      <td id="calendar-next" onClick={props.onNextClick}>
        <span className="material-symbols-outlined">chevron_right</span>
      </td>
    </tr>
  );
}

function Cell(props) {
  // Create variables from the properties for convenience sake
  let date = props.date;
  let rowIndex = props.rowIndex;
  let index = props.index;

  // Get the day of week for the 1st day in the selected month
  let firstDay = new Date(date);
  firstDay.setDate(1);
  firstDay = firstDay.getDay() - 1; // Make sunday the last day of the week
  if (firstDay === -1) firstDay = 6; // Make sunday the last day of the week

  // Calculate the date of the cell
  let cellDate = rowIndex * 7 + index - firstDay;

  // Is the cell part of the previous month?
  if (rowIndex === 0 && index <= firstDay) {
    // Get the length of the previous month
    let prevMonthDays = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();

    // Offset the date
    cellDate = prevMonthDays - (firstDay - index);

    // Create a date object that represents this cell
    let value = new Date(date);
    value.setDate(cellDate);
    value.setMonth(date.getMonth() - 1);

    // Return the cell
    return createCell(rowIndex, index, cellDate, value, true, null);
  }

  // Get the last date of the selected month
  let lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Is the cell part of the next month?
  if (cellDate > lastDate) {
    // Offset the date
    cellDate -= lastDate;

    // Create a date object that represents this cell
    let value = new Date(date);
    value.setDate(cellDate);
    value.setMonth(date.getMonth() + 1);

    // Return the cell
    return createCell(rowIndex, index, cellDate, value, null, true);
  }

  // Cell is part of the current month

  // Create a date object that represents this cell
  let value = new Date(date);
  value.setDate(cellDate);

  // Return the cell
  return createCell(
    rowIndex,
    index,
    cellDate,
    value,
    null,
    null,
    cellDate === date.getDate()
  );
}

function createCell(
  rowIndex,
  index,
  cellDate,
  date,
  prevMonth,
  nextMonth,
  selected = null
) {
  return (
    <td
      id={`calendar-cell-${rowLetters[rowIndex]}${index}`}
      value={date}
      className={classNames({
        "calendar-cell": true,
        "calendar-cell-prev": prevMonth,
        "calendar-cell-next": nextMonth,
        "calendar-cell-selected": selected,
      })}
    >
      {cellDate}
    </td>
  );
}

function Calendar(props) {
  let [date, setDate] = useState(props.date);

  function handleNextClick() {
    let newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  }

  function handlePrevClick() {
    let newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  }

  function handleResetClick() {
    setDate(new Date());
  }

  function handleCellClick(e) {
    let newDate = new Date(date);
    newDate.setDate(0); // <-- 0 to be replaced by the value of the cell
    setDate(newDate);
  }

  return (
    <div className="calendar">
      <table>
        <thead>
          <Navigation
            date={date}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
            onResetClick={handleResetClick}
          />
          <Headers />
        </thead>
        <tbody>
          <Row rowIndex={0} date={date} />
          <Row rowIndex={1} date={date} />
          <Row rowIndex={2} date={date} />
          <Row rowIndex={3} date={date} />
          <Row rowIndex={4} date={date} />
          <Row rowIndex={5} date={date} />
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
