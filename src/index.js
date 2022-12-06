import React from "react";
import ReactDOM from "react-dom/client";
import Calendar from "./Calendar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

function App() {
  return (
    <div>
      <h1>React Calendar</h1>
      <Calendar date={new Date()} />
      <br />
      <small>
        By <strong>Dennis Hankvist</strong> december 2022
      </small>
    </div>
  );
}
