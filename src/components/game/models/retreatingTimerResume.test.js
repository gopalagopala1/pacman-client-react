import RetreatingTimer from "./retreatingTimer";

jest.useFakeTimers();

describe("RetreatingTimer", () => {
  describe("resume", () => {
    it("calls setTimeout with the timeRemaining as the delay", () => {
      const mockGhost = {
        isRetreating: true,
        changeRetreatingState: () => undefined,
      };
      const retreatingTimer = new RetreatingTimer(mockGhost);
      retreatingTimer.timeRemaining = 1930;
      retreatingTimer.isRunning = true;
      jest.spyOn(global, "setTimeout");
      jest.spyOn(mockGhost, "changeRetreatingState");
      const mockDateNow = 13940;
      retreatingTimer.resume(mockDateNow);
      expect(retreatingTimer.startTime).toBe(13940);
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1930);
      expect(retreatingTimer.timeout).not.toBeNull();
      jest.runOnlyPendingTimers();
      expect(mockGhost.changeRetreatingState).toHaveBeenCalledTimes(1);
      expect(retreatingTimer.isRunning).toBeFalsy();
    });
  });
});
