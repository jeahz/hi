import React from 'react';
import CardItem from '../CardItem/CardItem'
import './Cards.css'

const Cards = () => {
  return (
    <div className="cards">
      <h1>My Projects</h1>

       <div className="cards__items">
         <CardItem
          text="Calculator ➕➖"
          label="calculator"
          path="/calculator"/>
         <CardItem
          text="Drum Machine 🥁"
          label="drum-machine"
          path="/drum-machine"/>
         <CardItem
          text="Pomodoro 🕓"
          label="pomodoro"
          path="/pomodoro"/>
         <CardItem
          text="Markdown Previewer 📝"
          label="markdown-previewer"
          path="/markdown-previewer"/>
         <CardItem
          text="Avatar Generator 🐴️"
          label="avatar-generator"
          path="/avatar-generator"/>
      </div>
    </div> 
    )
}

export default Cards;