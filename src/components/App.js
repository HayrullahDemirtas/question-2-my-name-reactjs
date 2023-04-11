import axios from "axios";
import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";
const baseURL = "http://localhost:8080/api/v1";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isStart: false,
      games: [],
      lastGameGuessList: [],
      game: null,
      guessWord: "",
      guessCount: 0,
      playerName: "",
    };
  }

  handleChange = (event) => {
    this.state.isStart
      ? this.setState({ guessWord: event.target.value })
      : this.setState({ playerName: event.target.value });
  };

  handleCreate = async () => {
    const { isStart, playerName, game, guessCount, guessWord } = this.state;

    if (!isStart) {
      const url = `${baseURL}/createGame?playerName=${playerName}`;
      try {
        const response = await axios.post(url);
        this.setState({
          game: response?.data,
          isStart: true,
          guessCount: 0,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      let url = `${baseURL}/createGuess`;
      try {
        const createGuessResponse = await axios.post(url, {
          gameId: game?.gameId,
          guessCount: guessCount + 1,
          guessWord: guessWord,
        });

        url = `${baseURL}/game?gameId=${game?.gameId}`;
        const getGameByGameIdResponse = await axios.get(url);

        this.setState({
          isStart: !createGuessResponse?.data?.complate,
          lastGameGuessList: getGameByGameIdResponse?.data?.guessList,
          guessCount: guessCount + 1,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  handleList = async () => {
    const { isStart, playerName } = this.state;

    if (!isStart) {
      const url = `${baseURL}/gameList?playerName=${playerName}`;
      try {
        const response = await axios.get(url);
        this.setState({
          games: response?.data,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      this.setState({
        isStart: false,
        games: [],
        lastGameGuessList: [],
        game: null,
        guessWord: "",
        guessCount: 0,
        playerName: "",
      });
    }
  };

  render() {
    const { isStart, games, game, playerName, lastGameGuessList } = this.state;

    return (
      <div className="container">
        <div className="input-group" style={{ marginTop: "5rem" }}>
          <input
            type="text"
            className="form-control"
            placeholder={isStart ? "Enter a guess word" : "Enter player name"}
            aria-label="enter player name and guess word"
            onChange={this.handleChange}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={this.handleCreate}
          >
            {isStart ? "Guess" : "Start"}
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={this.handleList}
          >
            {isStart ? "Finish" : "Show Game List"}
          </button>
        </div>
        {!isStart ? (
            games.map((item) => (
              <div
                className="row row-cols-1 row-cols-md-2 g-4"
                style={{ marginTop: "2rem" }}
                key={item.gameCount}
              >
                <Card
                  playerName={item.playerName}
                  gameCount={item.gameCount}
                  keyword={item.keyword}
                  guessList={item.guessList}
                />
              </div>
            ))
          ) : (
            <Card
              playerName={playerName}
              gameCount={game.gameCount}
              guessList={lastGameGuessList}
            />
          )}
      </div>
    );
  }
}

App.propTypes = {
  games: PropTypes.array,
  lastGameGuessList: PropTypes.array,
  game: PropTypes.object,
  isStart: PropTypes.bool,
  guessWord: PropTypes.string,
  playerName: PropTypes.string,
  guessCount: PropTypes.number,
};

export default App;
