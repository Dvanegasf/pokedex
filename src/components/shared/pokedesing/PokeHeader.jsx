import React from 'react';
import './styles/pokeHeader.css';
import { useNavigate } from 'react-router-dom';

const PokeHeader = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/pokedex`);
  }


  return (
    <div className='pokeheader'>
        <div className='pokeheader__red'>
          <figure className='pokeheader__img'>
            <img onClick={handleClick} src="../../../assets/pokedex.png" alt="pokedex image" />
          </figure>
        </div>
        <div className='pokeheader__black'>
          <div className='pokeheader__outcircle'>
            <div className='pokeheader__incircle'></div>
            <div className='pokeheader__inincircle'></div>
          </div>
        </div>
    </div>
  )
}

export default PokeHeader;