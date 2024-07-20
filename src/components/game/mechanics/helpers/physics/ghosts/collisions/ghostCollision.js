import axios from "axios";
import playGame from "../../../../playGame";
import Animator from "../../../graphics/animator/animator";
import Graphics from "../../../graphics/graphics";
import supabase from "../../../../../../main/supabase";

export default class GhostCollision {
  static collisionConditional(ghost, pacman) {
    return (
      ghost.position.y - ghost.radius <= pacman.position.y + pacman.radius &&
      ghost.position.y + ghost.radius >= pacman.position.y - pacman.radius &&
      ghost.position.x + ghost.radius >= pacman.position.x - pacman.radius &&
      ghost.position.x - ghost.radius <= pacman.position.x + pacman.radius
    );
  }

  static dealWithCollision(ghost, assets, variables, ctx) {
    if (!ghost.isScared && !ghost.isRetreating) {
      assets.characters.pacman.radians = Math.PI / 4;
      cancelAnimationFrame(variables.animationId);
      assets.audioPlayer.stopGhostAudio();
      assets.audioPlayer.playPacmanDeath();
      assets.characters.pacman.isShrinking = true;
      Graphics.runDeathAnimation(variables, ctx, assets);
    } else if (ghost.isScared) {
      variables.score += 200 * Math.pow(2, variables.killCount);
      variables.killCount++;
      ghost.changeRetreatingState();
      ghost.retreatingTimer.start();
      ghost.changeScaredState();
      ghost.assignSprite();
      ghost.checkSpeedMatchesState();
    }
  }

  static checkPacmanLives(
    assets,
    variables,
    ctx,
    endGame = GhostCollision.endGame,
    resetAfterDeath = GhostCollision.resetAfterDeath
  ) {
    if (assets.characters.pacman.lives <= 0) {
      endGame(variables, assets, ctx);
    } else {
      assets.characters.pacman.lives--;
      resetAfterDeath(assets, variables);
    }
  }

  //TODO: game is ending here

  static updatePoints = async (tokenId, newPoints) => {
    try {
      let insert = false;

      const gameId = "71ab6ea3-dff2-4918-9674-bb0b9cd4a380";
      // Fetch the current points
      let { data: currentData, error: fetchError } = await supabase
        .from("points")
        .select("*")
        .eq("tokenid", tokenId)
        .eq("game_id", gameId)
        .single();

      if (fetchError) {
        console.log("error message: ", fetchError.message, fetchError);

        if (!currentData) {
          insert = true;
          // If no existing points found, set currentPoints to 0
          currentData = { points: 0, tokenid: tokenId, game_id: gameId };
        } else {
          throw fetchError;
        }
      }

      // Add new points to the current points
      currentData.points = (currentData?.points || 0) + newPoints;

      if (insert) {
        const { data, error } = await supabase
          .from("points")
          .insert({
            ...currentData,
          })
          .single();

        if (error) throw error;
        insert = false;
      } else {
        // Update the points in the database
        const { data, error } = await supabase
          .from("points")
          .upsert({
            ...currentData,
          })
          .eq("tokenid", tokenId)
          .eq("game_id", gameId)
          .single();

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  static async endGame(
    variables,
    assets,
    ctx,
    saveScore = GhostCollision.saveScore,
    resetAfterGameOver = GhostCollision.resetAfterGameOver
  ) {
    cancelAnimationFrame(variables.animationId);
    Animator.displayPleaseWait(ctx);
    if (variables.player) {
      await GhostCollision.updatePoints(variables.player, variables.score);
    }

    resetAfterGameOver(assets, variables);
    variables.score = 0;
    variables.start = true;
    window.location.reload();
  }

  static async saveScore(
    variables,
    getBackendUrl = GhostCollision.getBackendUrl
  ) {
    const data = {
      username: variables.player.username,
      points: variables.score,
    };

    try {
      const res = await axios.post(
        getBackendUrl(process.env.REACT_APP_BACKEND_URL),
        data,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return `Success: ${res.data.message}`;
    } catch (err) {
      return `Error: ${err.response.data.message}`;
    }
  }

  static getBackendUrl(reactAppUrl) {
    let url;
    if (reactAppUrl) {
      url = `${reactAppUrl}/scores`;
    } else {
      url = "http://localhost:8080/scores";
    }
    return url;
  }

  static resetAfterGameOver(assets, variables) {
    assets.props.pellets.forEach((pellet) => {
      if (pellet.hasBeenEaten) pellet.changeEatenState();
    });
    assets.props.powerUps.forEach((powerUp) => {
      if (powerUp.hasBeenEaten) powerUp.changeEatenState();
    });
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    assets.timers.scaredTimer.duration = 7000;
    Object.values(assets.characters.ghosts).forEach((ghost) => {
      ghost.reset();
    });
    assets.characters.pacman.reset();
    assets.characters.pacman.lives = 2;
    variables.lastKeyPressed = "";
    variables.level = 1;
    window.removeEventListener("keydown", variables.directionEventListener);
    window.removeEventListener(
      "visibilitychange",
      variables.visibilityEventListener
    );
    window.removeEventListener("keydown", variables.pauseEventListener);
  }

  static resetAfterDeath(assets, variables, callbackOne = playGame) {
    assets.characters.pacman.reset();
    variables.lastKeyPressed = "";
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    Object.values(assets.characters.ghosts).forEach((ghost) => {
      ghost.reset();
    });
    assets.timers.cycleTimer.start();
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    callbackOne(variables.player, variables.reactRoot);
  }
}
