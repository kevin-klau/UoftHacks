import React, { useEffect, useRef, useState } from "react";
import Vex from "vexflow";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useSocket from "../utils/useSocket";

let testdata = [
  { note: "C1", magnitude: "c", time: 750, value: 4 },
  { note: "C1", magnitude: "c", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "A", magnitude: "a", time: 750, value: 4 },
  { note: "A", magnitude: "a", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 1500, value: 2 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "D", magnitude: "d", time: 750, value: 4 },
  { note: "D", magnitude: "d", time: 750, value: 4 },
  { note: "C1", magnitude: "c", time: 1500, value: 2 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "D", magnitude: "d", time: 1500, value: 2 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "D", magnitude: "d", time: 1500, value: 2 },
  { note: "C1", magnitude: "c", time: 750, value: 4 },
  { note: "C1", magnitude: "c", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 750, value: 4 },
  { note: "A", magnitude: "a", time: 750, value: 4 },
  { note: "A", magnitude: "a", time: 750, value: 4 },
  { note: "G", magnitude: "g", time: 1500, value: 2 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "F", magnitude: "f", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "E", magnitude: "e", time: 750, value: 4 },
  { note: "D", magnitude: "d", time: 750, value: 4 },
  { note: "D", magnitude: "d", time: 750, value: 4 },
  { note: "C1", magnitude: "c", time: 1500, value: 4 },
];

const Learn = () => {
  const [_, noteP1] = useSocket("noteP1");
  const [frame, noteP2] = useSocket("noteP2");
  const [toggle, setToggle] = useState(true);

  // Player 1 and 2's Data Values
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correct1, setCorrect1] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [currIndex1, setCurrIndex1] = useState(0);

  const outputRef = useRef(null); // Create a ref for the DOM element
  const outputRef1 = useRef(null);
  const [showTimer, setShowTimer] = useState(true);

  const pause1 = () => { setIsPlaying1(true); };
  const stop1 = () => { setIsPlaying1(false); };
  const pause = () => { setIsPlaying(true); };
  const stop = () => { setIsPlaying(false); };

 
  // Handler for When The Handler is Complete
  const handleTimerComplete = () => {
    setShowTimer(false); // Hide the timer
    return [false, 0]; // Stop the timer
  };

  // Updates Correct Variables When Notes are Played Correctly
  useEffect(() => {
    const interval = setInterval(() => {
      if (toggle && correct) {
        pause();
        setCorrect(false);
        setToggle(false); // Toggle the state
      } else {
        stop();
        setToggle(true); // Toggle the state
      }
      if (toggle && correct1) {
        pause1();
        setCorrect1(false);
        setToggle(false);
      } else {
        stop1();
        setToggle(true);
      }
    }, 950); // Interval set for 3 seconds

    return () => clearInterval(interval);
  }, [correct, correct1]); // Dependency on toggle state

  /* Update the Index Whenever Player 1 Plays The Correct Note */
  useEffect(() => {
    if (noteP1 == testdata[currIndex].note.toLowerCase()) {
      console.log("CORRECT");
      setCorrect(true);
      setCurrIndex(currIndex + 1);
    }
    setTimeout(50);
  }, [noteP1]);

  /* Update the Index Whenever Player 2 Plays The Correct Note */
  useEffect(() => {
    if (noteP2 == testdata[currIndex1].note.toLowerCase()) {
      console.log("CORRECT");
      setCorrect1(true);
      setCurrIndex1(currIndex1 + 1);
    }
    setTimeout(50);
  }, [noteP2]);

  /* Create The Actual Musical Notes + Sheet Music */
  useEffect(() => {
    // Drawing P1's Notes
    if (outputRef.current) {
      outputRef.current.innerHTML = "";
      const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

      const renderer = new Renderer(outputRef.current, Renderer.Backends.SVG);
      renderer.resize(window.innerWidth / 2, 120); 
      const context = renderer.getContext();

      const stave = new Stave(50, 0, window.innerWidth / 2);
      stave.addClef("treble").addTimeSignature("4/4");
      stave.setContext(context).draw();

      const notes = testdata.map((data) => {
        const noteKey = data.magnitude + (data.note === "C2" ? "/5" : "/4");
        return new StaveNote({
          keys: [noteKey],
          duration: String(data.value),
        });
      });

      const voice = new Voice({ num_beats: 4, beat_value: 4 });
      voice.setStrict(false);
      voice.addTickables(notes);

      new Formatter().joinVoices([voice]).format([voice], 1500);
      voice.draw(context, stave);
    }

    // Drawing P2's Notes
    if (outputRef1.current) {
      outputRef1.current.innerHTML = "";
      const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

      const renderer1 = new Renderer(outputRef1.current, Renderer.Backends.SVG);
      renderer1.resize(window.innerWidth / 2, 120); 
      const context1 = renderer1.getContext();

      const stave1 = new Stave(50, 0, window.innerWidth / 2); 
      stave1.addClef("treble").addTimeSignature("4/4");
      stave1.setContext(context1).draw();

      const notes1 = testdata.map((data) => {
        const noteKey1 = data.magnitude + (data.note === "C2" ? "/5" : "/4");
        return new StaveNote({
          keys: [noteKey1],
          duration: String(data.value),
        });
      });

      // Create a voice in 4/4 and add the notes
      const voice1 = new Voice({ num_beats: 4, beat_value: 4 });
      voice1.setStrict(false); // Disable the total duration check of the voice
      voice1.addTickables(notes1);

      // Format and justify the notes to the width of the stave
      new Formatter().joinVoices([voice1]).format([voice1], 1500);
      voice1.draw(context1, stave1);
    }
  }, []);


  return (
    <div id="multi">
      <div id="sheet-music-container">

      {/* Musical Sheet w/ Notes */}
      <div id="learn-carousel">
          {/* Player 1 Musical Sheet */}
          <div id="learn-slide1">
            <div
              id="learn-slide"
              style={{
                width: "50vw",
                animation: "15s sheetmusic linear",
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            >
              <div id="output" ref={outputRef}></div>
            </div>

            {/* Player 2 Musical Sheet */}
            <div
              id="learn-slide"
              style={{
                overflowX: "none",
                width: "50vw",
                animation: "14s sheetmusic linear",
                animationPlayState: isPlaying1 ? "running" : "paused",
              }}
            >
              <div id="outputP1" ref={outputRef1}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Moving Bars */}
      <div id="redBarL"></div>
      <div id="redBarR"></div>
      <div id="multi-titlecontainer">

      {/* Camera Frame */}
      <div id="rectangle">
          <img
            src={`data:image/jpeg;base64,${frame}`}
            alt="Stream Fail"
            style={{ height: "100%" }}
          />
          <div id="timer">
            {showTimer && ( // Render the timer only if showTimer is true
              <CountdownCircleTimer
                isPlaying
                duration={10}
                colors={[
                  ["#red", 0.33],
                  ["#red", 0.33],
                  ["#red", 0.33],
                ]}
                onComplete={handleTimerComplete}
              >
                {({ remainingTime }) => (
                  <span id="timeCount">{remainingTime}</span>
                )}
              </CountdownCircleTimer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
