import React from 'react';
import {Link} from 'react-router-dom';
import './CardItem.css'

const CardItem = ({ text, path}) => {
  return (
    <>
    <li className="card-item" id="card-item">
    <Link className="cards_item_link" to={path}>
    <div className="cards_item_info">
    <h5 className="cards_item_text">{text}</h5>
    </div>
    </Link>
    </li>
    </>
    )
}

export default CardItem;

