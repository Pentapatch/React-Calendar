import React from "react";
import ReactDOM from "react-dom/client";
import Calendar from "./Calendar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Tester />);

// <script type="text/babel">
// Babel används för att omvandla script så det stöds i äldre webläsare

function Tester() {
  let selectedMonth = new Date();
  selectedMonth.setMonth(11);

  return (
    <div>
      <h1>React Calendar</h1>
      <Calendar date={selectedMonth} />
      <br />
      <small>
        By <strong>Dennis Hankvist</strong> december 2022
      </small>
    </div>
  );
}
