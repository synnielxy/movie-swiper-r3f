import { Modal } from "./Modal"
import { state } from "../App";

export const Overlay = () => {

  const handleClick = () => {
    if (state.page === 457) {
      state.page = 1;
    } else {
      state.page++;
    }
  };

  return (
    <div >
      <div style={{ position: 'absolute', bottom: 50, left: 90, fontSize: '13px' }}>
        New Movies
      </div>
      <button onClick={handleClick} className="icon-button" aria-label="Description of action" style={{ position: 'absolute', bottom: 40, left: 40 }}>
        <i className='bx bx-refresh'></i>
      </button>
      <a href="https://www.themoviedb.org/" style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }}>Top Rated Movies from TMDB -</a>
      <div className="logo" style={{ position: 'absolute', bottom: 72, right: 37, fontSize: '36px', letterSpacing: '2px', zIndex: 1000 }}>Movie</div>
      <div className="logo" style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '40px', letterSpacing: '2px', zIndex: 1000 }}>Swiper</div>
      <Modal />
    </div>
  )
}