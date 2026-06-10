import React, { useEffect, useState } from 'react';
import './styles/pokeLoader.css';

const PokeLoader = ({ onOpen, onDone }) => {
  const [phase, setPhase] = useState('spinning');

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('open'); onOpen(); }, 1000);
    const t2 = setTimeout(() => setPhase('hide'), 1700);
    const t3 = setTimeout(() => onDone(), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className={`pokeloader ${phase === 'hide' ? 'pokeloader--hide' : ''}`}>
      <div className={`pokeloader__ball 
        ${phase === 'spinning' ? 'pokeloader__ball--spin' : ''} 
        ${phase === 'open' || phase === 'hide' ? 'pokeloader__ball--open' : ''}`}>
        <div className="pokeloader__flash"></div>
        <div className="pokeloader__top"></div>
        <div className="pokeloader__belt"></div>
        <div className="pokeloader__button"></div>
        <div className="pokeloader__bottom"></div>
      </div>
    </div>
  );
};

export default PokeLoader;