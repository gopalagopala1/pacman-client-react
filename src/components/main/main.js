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

  const handleSubmit = () => {
    const player = user ? user : undefined;
    theme.pause();
    if (reactRoot) {
      reactRoot.render(<Game player={player} reactRoot={reactRoot} />);
    } else {
      const root = ReactDOM.createRoot(document.getElementById("subRoot"));
      root.render(<MainPage player={player} root={root} />);
    }
  };

  console.log("react root: ");

  return (
    <div className="main" id="main">
      <button className="play-button" id="play-button" onClick={handleSubmit}>
        Play
      </button>
    </div>
  );
}

function MainPage({ player, root }) {
  return (
    <div className="flex h-full w-full">
      <div className="h-screen w-1/4 bg-slate-500"></div>
      <div className="ml-20">
        <Game player={player} reactRoot={root} />
      </div>
      <button>Connect Wallet</button>
    </div>
  );
}
