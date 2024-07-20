import React, { useEffect } from "react";
import "./game.css";
import playGame from "./mechanics/playGame";

export default function Game({ player, reactRoot, callback = playGame }) {
  useEffect(() => {
    callback(player, reactRoot);
  }, [callback, player, reactRoot]);

  return (
    <div>
      <div className="game">
        <canvas
          id="info"
          className="info"
          data-testid="info"
          width="1200"
          height="30"
        ></canvas>
        <canvas
          id="board"
          className="board"
          data-testid="board"
          width="1000"
          height="990"
        ></canvas>
      </div>
    </div>
  );
}
