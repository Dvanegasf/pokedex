import React from 'react';
import './styles/pagin.css';

const Pagin = ({ paginate, setPaginate, total }) => {

  const goTo = (page) => {
    if (page < 1 || page > total) return;
    setPaginate(page);
  };

  // Genera los números cercanos: 2 a cada lado de la actual
  const getPages = () => {
    const pages = [];
    for (let i = -2; i <= 2; i++) {
      const p = paginate + i;
      if (p >= 1 && p <= total) pages.push(p);
    }
    return pages;
  };

  return (
    <div className='pages'>
      <button
        className='pages__btn'
        onClick={() => goTo(1)}
        disabled={paginate === 1}
      >
        «
      </button>

      <button
        className='pages__btn'
        onClick={() => goTo(paginate - 1)}
        disabled={paginate === 1}
      >
        ‹
      </button>

      {/* Puntos suspensivos izquierda */}
      {paginate > 3 && (
        <span className='pages__dots'>...</span>
      )}

      {getPages().map(p => (
        <button
          key={p}
          className={`pages__btn ${p === paginate ? 'pages__btn--active' : ''}`}
          onClick={() => goTo(p)}
        >
          {p}
        </button>
      ))}

      {/* Puntos suspensivos derecha */}
      {paginate < total - 2 && (
        <span className='pages__dots'>...</span>
      )}

      <button
        className='pages__btn'
        onClick={() => goTo(paginate + 1)}
        disabled={paginate === total}
      >
        ›
      </button>

      <button
        className='pages__btn'
        onClick={() => goTo(total)}
        disabled={paginate === total}
      >
        »
      </button>

      <span className='pages__info'>
        {paginate} / {total}
      </span>
    </div>
  );
};

export default Pagin;