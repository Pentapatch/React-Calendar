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

function Headers(props) {
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

function Cell(props) {
  return (
    <td id={`calendar-cell-${rowLetters[props.rowIndex]}${props.index}`}>
      {GetDay(props.date, props.rowIndex, props.index)}
    </td>
  );
}

function GetDay(date, rowIndex, index) {
  // Get the day of week for the 1st day in the selected month
  let firstDay = new Date(date);
  firstDay.setDate(1);
  firstDay = firstDay.getDay() - 1;
  if (firstDay === -1) firstDay = 6; // Make sunday be the last day of the week

  if (rowIndex === 0 && index <= firstDay) {
    return 0;
  }

  // Get the day of wee for the 1st day in the month next to the selected month
  let firstDayOfNext = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  let lastDay = firstDayOfNext.getDate();

  console.log(firstDayOfNext);

  // console.log(index);
  // console.log(firstDay);

  return GetOffset(rowIndex, index, firstDay, lastDay);
}

function GetOffset(rowIndex, index, firstDay, lastDay) {
  let result = rowIndex * 7 + index - firstDay;

  if (result > lastDay) result -= lastDay;

  return result;
}

function Calendar(props) {
  let date = props.date;

  return (
    <div className="calendar">
      <div className="calendar-month" id="calendar-month">
        {monthNames[date.getMonth()] + " " + date.getFullYear()}
      </div>
      <table>
        <thead>
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
      <p>{date.toLocaleDateString()}</p>
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
