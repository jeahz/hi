import React, { useState, useEffect } from "react";
import "./Pomodoro.scss";

const Clock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [time, setTime] = useState(sessionLength * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [start, setStart] = useState(false);
  const minute = Math.floor(time / 60);
  const second = Math.round(time % 60);

  useEffect(() => {
    const beep = document.getElementById("beep");
    if (start) {
      if (isBreak) {
        const interval = setInterval(() => {
          setTime((timez) => {
            if (Number(timez) >= 1) {
              return Number(timez) - 1;
            } else {
              setIsBreak(false);
              setTime(Number(sessionLength) * 60);
              beep.play();
              return 0;
            }
          });
        }, 1000);
        return () => clearInterval(interval);
      } else {
        const interval = setInterval(() => {
          setTime((timez) => {
            if (Number(timez) >= 1) {
              return Number(timez) - 1;
            } else {
              setIsBreak(true);
              setTime(Number(breakLength) * 60);
              beep.play();
              return 0;
            }
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [start, isBreak]);

  const handleChange = (e) => {
    if (e.target.id === "session-length") {
      setSessionLength(Number(e.target.value));
      setTime(Number(e.target.value) * 60);
    } else if (e.target.id === "break-length") {
      setBreakLength(Number(e.target.value));
    }
  };

  const handleClick = (e) => {
    const target = e.currentTarget.id;
    if (target === "break-decrement") {
      if (breakLength > 1) {
        setBreakLength((breakLength) => Number(breakLength) - 1);
        isBreak && setTime((time) => time - 1 * 60);
      }
    } else if (target === "break-increment") {
      if (breakLength <= 59) {
        setBreakLength((breakLength) => Number(breakLength) + 1);
        isBreak && setTime((time) => time + 1 * 60);
      }
    }

    if (target === "session-decrement") {
      if (sessionLength > 1) {
        setSessionLength((sessionLength) => Number(sessionLength) - 1);
        !isBreak && setTime((time) => time - 1 * 60);
      }
    } else if (target === "session-increment") {
      if (sessionLength <= 59) {
        setSessionLength((sessionLength) => Number(sessionLength) + 1);
        !isBreak && setTime((time) => time + 1 * 60);
      }
    }

    if (target === "start_stop") {
      if (start) {
        setStart(false);
      } else {
        setStart(true);
      }
    } else if (target === "reset") {
      const beep = document.getElementById("beep");
      setBreakLength(5);
      setSessionLength(25);
      setStart(false);
      isBreak && setIsBreak(false);
      setTime(25 * 60);
      beep.pause();
      beep.currentTime = 0;
    }
  };

  return (
    <div className="pomodoro-container">
      <div className="container-fluid">
        <audio
          src="https://res.cloudinary.com/dymnej9mt/video/upload/v1632633269/mixkit-censorship-beep-1082_gfemv9.wav"
          id="beep"
        ></audio>
        <div className="lengths-container">
          <div className="length-container">
            <div className="length-label" id="break-label">
              Break Length
            </div>
            <div className="length-control">
              <button id="break-increment" onClick={handleClick}>
                <i className="fas fa-chevron-up"></i>
              </button>
              <div id="break-length">{breakLength}</div>
              <button id="break-decrement" onClick={handleClick}>
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
          </div>
          <div className="length-container">
            <span className="length-label" id="session-label">
              Session Length
            </span>
            <div className="length-control">
              <button id="session-increment" onClick={handleClick}>
                <i className="fas fa-chevron-up"></i>
              </button>
              <div id="session-length">{sessionLength}</div>
              <button id="session-decrement" onClick={handleClick}>
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="timer">
          <div id="timer-label">{isBreak ? "Break" : "Session"}</div>
          <span id="time-left">
            {minute < 10 ? "0" + minute : minute}:
            {second < 10 ? "0" + second : second}
          </span>
          <div id="timer-control">
            <button id="start_stop" onClick={handleClick}>
              <i className="fas fa-play"></i>
              <i className="fas fa-pause"></i>
            </button>
            <button id="reset" onClick={handleClick}>
              <i className="fas fa-step-backward"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
