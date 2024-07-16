import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import Game from "../game/game";
import { Howl } from "howler";

export default function Main({ reactRoot, user }) {
  const [theme] = useState(
    new Howl({
      src: ["./audio/title_theme.wav"],
      loop: true,
      volume: 0.3,
    })
  );

  useEffect(() => {
    theme.play();
    window.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();
      }
    });
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleSubmit = () => {
    const player = user ? user : undefined;
    theme.pause();
    if (reactRoot) {
      reactRoot.render(<Game player={player} reactRoot={reactRoot} />);
    } else {
      const root = ReactDOM.createRoot(document.getElementById("subRoot"));
      root.render(<Game player={player} reactRoot={root} />);
    }
  };

  

  return (
    <div className="main" id="main">
      <br></br>
      <br></br>
      <img
        className="title-gif"
        src="https://media4.giphy.com/media/42rO49pxzaMnK/giphy.gif?cid=790b76116dc1bedf27887938cbe8df55b210b12f842af0e9&rid=giphy.gif&ct=g"
        alt="Pac-Man gif"
      />

      <button className="play-button" id="play-button" onClick={handleSubmit}>
        Play
      </button>
    </div>
  );
}
