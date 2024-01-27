import React, { useEffect, useRef } from 'react';
import Vex from 'vexflow';

const Multiplayer = () => {
  const outputRef = useRef(null); // Create a ref for the DOM element

  useEffect(() => {
    if (outputRef.current) {
      const { Factory, EasyScore, System } = Vex.Flow;

      const vf = new Factory({
        renderer: { elementId: outputRef.current.id, width: 500, height: 200 },
      });

      const score = vf.EasyScore();
      const system = vf.System();

      system.addStave({
        voices: [
          score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
          score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
        ],
      })
      .addClef('treble')
      .addTimeSignature('4/4');

      vf.draw();
    }
  }, []); // The empty dependency array ensures this runs only once after the component mounts

  return (
    <div>
      <div id="multi-titlecontainer">
        <div id="multi-title">Multiplayer</div>
      </div>
      <div id="sheet-music-container">
        {/* Attach the ref to the div which will contain the sheet music */}
        <div id="output" ref={outputRef}></div>
      </div>
    </div>
  );
};

export default Multiplayer;
