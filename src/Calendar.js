import classNames from "classnames";
import BookingManager from "./BookingManager";
import "./style.css";

let mgr = new BookingManager();

mgr.populate();

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
      <td id="calendar-month" colSpan={5}>
        {monthNames[props.date.getMonth()] + " " + props.date.getFullYear()}
      </td>
      <td id="calendar-prev">
        <span class="material-symbols-outlined">chevron_left</span>
      </td>
      <td id="calendar-next">
        <span class="material-symbols-outlined">chevron_right</span>
      </td>
    </tr>
  );
}

function Cell(props) {
  let date = props.date;
  let rowIndex = props.rowIndex;
  let index = props.index;

  // Get the day of week for the 1st day in the selected month
  let firstDay = new Date(date);
  firstDay.setDate(1);
  firstDay = firstDay.getDay() - 1;
  if (firstDay === -1) firstDay = 6; // Make sunday be the last day of the week

  let cellDate = rowIndex * 7 + index - firstDay;

  // Is the cell part of the previous month?
  if (rowIndex === 0 && index <= firstDay) {
    // Get the length of the previous month
    let prevMonthDays = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();

    cellDate = prevMonthDays - (firstDay - index);
    return createCell(rowIndex, index, cellDate, true, null);
  }

  // Get the last date of the selected month
  let lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Is the cell part of the next month?
  if (cellDate > lastDate) {
    cellDate -= lastDate;
    return createCell(rowIndex, index, cellDate, null, true);
  }

  // Cell is part of the current month
  return createCell(
    rowIndex,
    index,
    cellDate,
    null,
    null,
    cellDate === date.getDate()
  );
}

function createCell(
  rowIndex,
  index,
  cellDate,
  prevMonth,
  nextMonth,
  selected = null
) {
  return (
    <td
      id={`calendar-cell-${rowLetters[rowIndex]}${index}`}
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
  let date = props.date;

  return (
    <div className="calendar">
      <table>
        <thead>
          <Navigation date={date} />
          <Headers />
        </thead>
        <tbody>
          <Row rowIndex={0} date={props.date} />
          <Row rowIndex={1} date={props.date} />
          <Row rowIndex={2} date={props.date} />
          <Row rowIndex={3} date={props.date} />
          <Row rowIndex={4} date={props.date} />
          <Row rowIndex={5} date={props.date} />
        </tbody>
      </table>
    </div>
  );
}

// function AddBookedDays() {
//   let result = [];
//   mgr.getDays().forEach((booking) => {
//     result.push(AddBookedDay(booking));
//   });
//   return result;
// }

// function AddBookedDay(booking) {
//   return <p>{booking.getDate().toLocaleDateString()}</p>;
// }

// function AddBookedSessions(day) {
//   let result = [];
//   booking.getDays().forEach((session) => {
//     result.push(AddBookedSession(booking));
//   });
//   return result;
// }

// function AddBookedSession(session) {
//   return <p>{session.getDate().toLocaleDateString()}</p>;
// }

export default Calendar;
