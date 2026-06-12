import React, { useEffect, useState } from 'react';
import './styles/pokeLoader.css';

const PokeLoader = ({ onOpen, onDone }) => {
  const [phase, setPhase] = useState('spin');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('zoom'), 700);
    const t2 = setTimeout(() => { setPhase('open'); onOpen(); }, 1400);
    const t3 = setTimeout(() => setPhase('hide'), 2200);
    const t4 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className={`pokeloader ${phase === 'hide' ? 'pokeloader--hide' : ''}`}>
      <div className={`pokeloader__ball
        ${phase === 'spin'  ? 'pokeloader__ball--spin' : ''}
        ${phase === 'zoom' || phase === 'open' || phase === 'hide' ? 'pokeloader__ball--zoom' : ''}
        ${phase === 'open' || phase === 'hide' ? 'pokeloader__ball--open' : ''}
      `}>
        <div className="pokeloader__flash"></div>
        <div className="pokeloader__top"></div>
        <div className="pokeloader__belt"></div>
        <div className="pokeloader__belt2"></div>
        <div className="pokeloader__button"></div>
        <div className="pokeloader__button2"></div>
        <div className="pokeloader__bottom"></div>
      </div>
    </div>
  );
};

export default PokeLoader;