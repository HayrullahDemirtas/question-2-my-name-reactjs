import React from "react";
import PropTypes from "prop-types";

const Card = ({ playerName, gameCount, keyword, guessList }) => {
  return (
    <div className="col" key={gameCount}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{playerName}</h5>
          <h5 className="card-title">{keyword}</h5>
          <h5 className="card-title">Game Count: {gameCount}</h5>

          {guessList.map((item) => (
            <ul className="list-group list-group-flush" key={item.guessCount}>
              <li className="list-group-item">Guess Count: {item.guessCount}</li>
              <li className="list-group-item">{item.description}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  gameCount: PropTypes.number,
  keyword: PropTypes.string,
  playerName: PropTypes.string,
  guessList: PropTypes.array,
};

export default Card;
