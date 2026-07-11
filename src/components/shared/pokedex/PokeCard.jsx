import React, { useEffect, memo } from 'react'
import useFetch from '../../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import './styles/pokeCard.css';

const PokeCard = ({url}) => {

    const [pokemon, getPokemon] = useFetch();

    const navigate = useNavigate();

    
    useEffect(() => {
      getPokemon(url)
    }, [url]);

    const handleClick = () => {
      navigate(`/pokedex/${pokemon.name}`);
    }

  // console.log(pokemon)
  return (
    <article className={`pokecard  ${pokemon?.types[0].type.name}`} onClick={handleClick}>
      <div className={`pokecard__back ${pokemon?.types[0].type.name}`}></div>
      <span className='pokecard__id '>#{pokemon?.id}</span>
        <figure className='pokecard__img'>
            <img loading='lazy' src={pokemon?.sprites.other['official-artwork'].front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`} alt="pokemon image" />
        </figure>
        <h3 className='pokecard__name noshadow'>{pokemon?.name}</h3>
        <span className='pokecard__span noshadow'>Type :</span>
        <ul className='pokecard__types'>
            {
                pokemon?.types.map((type, index) => (
                  <li className={`slot__${type.slot} ${pokemon?.types[index]?.type.name}`} key={type.type.url}>
                    {type.type.name}
                  </li>
                ))
            }
        </ul>
        <hr className='pokecard__hr' />
        <div>
          <ul className='pokecard__stats '>
            {
              pokemon?.stats.map(stat => (
                !stat.stat.name.includes('special') && 
                <li key={stat.stat.url}>
                  <span className='pokecard__stats1 '>{stat.stat.name}</span>
                  <span className={`pokecard__stats2 noshadow ${pokemon?.types[0].type.name}2`}>{stat.base_stat}</span>
                </li>
              ))
            }
          </ul>
        </div>
    </article>
  )
}

export default PokeCard;