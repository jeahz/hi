import React, {useState, useEffect} from "react";
import './DrumMachine.css'

const DrumPad = ({drumpad, audioName, audio, handleClick}) => {
  
  return (
    <>
      {
      drumpad.map((pad, index) => {
        return (
      <button className="drum-pad button btn-primary" onClick={(e) => handleClick(e)}
      id={audioName[index]} key={index}>{pad}<audio className="clip" id={pad} src={audio[index]} preload="auto"></audio></button>
      );
      })
      }
  </>
    )
}

const DrumMachine = () => {
  const [clicked, setClicked] = useState('')
  const drumpad = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
  const audioName = ['clap', 'crash', 'hi-hat1', 'hi-hat2', 'kick1', 'kick2', 'perc1', 'perc2', 'snare'];
  const audio = [
    'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3', 
    'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3', 
    'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
    'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3', 
    'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3', 
    'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
    'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3',
    'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3', 
    'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'];
  
  const handleClick = (e, key) => {
    if(e) {
    const audioKey = e.target.children[0].id;
    const audioNameIndex = drumpad.indexOf(audioKey);
    const audioEl = document.getElementById(audioKey);
    audioEl.currentTime = 0;
    setClicked(audioName[audioNameIndex]);
    return audioEl.play();
    } else {
      const clickedPad = document.getElementById(key);
      const audioNameIndex = drumpad.indexOf(key);
      setClicked(audioName[audioNameIndex]);
      clickedPad.currentTime = 0;
      return clickedPad.play();
    }
  };
  
  const handleKeyDown = (e) => {
    for(let key of drumpad) {
      if(e.key === `${key.toLowerCase()}`) {
        handleClick(null, key);
      }
    }
  }
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return (() => { 
    return window.removeEventListener('keydown', handleKeyDown)})
  });
  
  return (
    <>
    <div id="drum-container">
    <div id="drum-machine">
    <div className="pad-container">
        <DrumPad drumpad={drumpad} audio={audio} handleClick={handleClick} audioName={audioName} />
    </div>
    </div >
    <div className="d-flex justify-content-center" id="display-container"><span className="badge badge-info d-flex justify-content-center align-items-center" id="display-drum">{clicked}</span></div>
    </div>
    </>
    )
};

export default DrumMachine;