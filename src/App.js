import React from "react";
import "./App.css";
import MainHOC from "./components/main/mainHOC";

export default function App() {
  return (
    <div className="App">
      <div id="subRoot" className="h-full">
        <MainHOC />
      </div>
    </div>
  );
}
