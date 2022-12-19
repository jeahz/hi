import React from 'react';
import CardItem from '../CardItem/CardItem';
import { cards } from './Cards.config';
import './Cards.scss';

const Cards = () => {
  return (
    <div className="cards">
      <h1>My Projects</h1>

       <div className="cards__items">
        {
          cards.map((card) => {
            const { text, label } = card;

            return (
              <CardItem
              text={ text }
              label={ label }
              path={ '/' + label }
              />
            )
          })
        }
      </div>
    </div> 
    )
}

export default Cards;