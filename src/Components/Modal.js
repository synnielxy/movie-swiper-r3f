
import "./Modal.css";
import { usePlay } from "../contexts/Play";
import { state } from "../App";

export const Modal = () => {

  const { isModalVisible, setModalVisible } = usePlay();
  // if (!isModalVisible) return null;
  const clickedIndex = state.clicked;
  const click = (e) => {
    if (e.target.className === "modalBackground") {
      setModalVisible(false);
    }
  }

  return (
    <div className={`modalBackground ${isModalVisible ? 'slide-in' : 'slide-out'}`} onClick={click}>
      <div className={`modalContainer`}>
        <div className="titleCloseBtn">
          <button
            onClick={() => setModalVisible(false)}
          >
            X
          </button>
        </div>

        <div className="grid-container">

          <div className="column1">
            <div className="title">
              <h1>{state.title[clickedIndex]}</h1>
            </div>

            <img alt="" className="poster" src={state.urls[clickedIndex]}></img>

            <p id="release_date">{state.release_date[clickedIndex]}</p>
          </div>

          <div className="column2">
            <div className="info">

              <p id="vote_average">{state.vote_average[clickedIndex]}</p>
            </div>
            <div className="body">
              <p>{state.overview[clickedIndex]}</p>
            </div>
            <div className="footer">
              <button
                onClick={() => window.open(state.pages[clickedIndex], '_blank')}
                id="linkBtn"
              >
                Learn More
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};