import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import PokeHeader from '../components/shared/pokedesing/PokeHeader';
import PokeFooter from '../components/shared/pokedesing/PokeFooter';
import Numbers from '../components/shared/pokeInfo/Numbers'
import Evolves from '../components/shared/pokeInfo/Evolves';
import Forms from '../components/shared/pokeInfo/Forms';
import Moves from '../components/shared/pokeInfo/Moves';
import './styles/pokeInfo.css';
import '../components/shared/pokedex/styles/pokeCard.css'

const PokeInfo = () => {

  const [pokemon, getPokemon] = useFetch();
  const [species, getSpecies] = useFetch();
  const [count, getCount] = useFetch();
  const [more1poke, getMore1poke] = useFetch();
  const [minus1poke, getMinus1poke] = useFetch();
  //const [item, getItem] = useFetch();
  
  
  const navigate = useNavigate();
  
  const { id } = useParams();
  const [evosLoaded, setEvosLoaded] = useState(false);
  const [formsLoaded, setFormsLoaded] = useState(false);
  const [pokedexLoaded, setPokedexLoaded] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [isMale, setIsMale] = useState(true);
  const [movesLoaded, setMovesLoaded] = useState(false);

  useEffect(() => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const url3 = `https://pokeapi.co/api/v2/pokemon-species/?limit=10000/`;
    //const url4 = `https://pokeapi.co/api/v2/item`;
    
    
    // console.log(url)
    // console.log(url3)
    // console.log(url4)
    
    
    
    getPokemon(url);
    getCount(url3);
    // getItem(url4)
    
    window.scrollTo(0, 0);
    setIsShiny(false);
    setIsMale(true);
    setPokedexLoaded(false);
    setEvosLoaded(false);
    setFormsLoaded(false);
    setMovesLoaded(false);
  }, [id]);
  
  useEffect(() => {
    if (!pokemon?.id) return;
    const total = count?.count;
    const url2 = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`;
    // console.log(total)
    
    const nextId = pokemon.id >= total ? 1 : pokemon.id + 1;
    const prevId = pokemon.id <= 1 ? total : pokemon.id - 1;
    
    // console.log(url2)
    // console.log(nextId, prevId)
    
    getSpecies(url2);
    getMore1poke(`https://pokeapi.co/api/v2/pokemon/${nextId}/`);
    getMinus1poke(`https://pokeapi.co/api/v2/pokemon/${prevId}/`);
}, [pokemon, count]);




  

  const pokeballs = [
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
]
  
  
  
  
  // cuantos botones quedan pendientes
  const pendingButtons = [
    !evosLoaded,
    !formsLoaded,
    !movesLoaded,
    !pokedexLoaded,
  ].filter(Boolean).length;
  
  
  
  const getSprite = () => {
    const sprites = pokemon?.sprites.other['home'];
    if (isShiny && isMale) return sprites?.front_shiny;
    if (isShiny && !isMale) return sprites?.front_shiny_female || sprites?.front_shiny;
    if (!isShiny && !isMale) return sprites?.front_female || sprites?.front_default;
    return sprites?.front_default;
  };
const playSound = () => {
  const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon?.id}.ogg`);
  audio.play();
}

  const handleClick = () => {
    navigate(`/pokedex/${more1poke?.name}`);
  }
  const handleClick2 = () => {
    navigate(`/pokedex/${minus1poke?.name}`);
  }

    // console.log(pokemon)
    // console.log(species)
    // console.log(count?.count)
    // console.log(more1poke)
    // console.log(minus1poke)
    // console.log(item)

  return (
    <section className='pokeinfo'>
      <button  className='next' onClick={handleClick}> next</button>
      <button  className='prev' onClick={handleClick2}> previus</button>
      <button className='pokeinfo__cry-btn' onClick={playSound}>
        🔊
      </button>
      <PokeHeader/>
      <div className='pokeinfo__contP'>

        <div  className='princi__numbers'>
          {/* ── Contenedor principal ── */}
          <div className='pokeinfo__cont'>
            <div className='pokeinfo__top'>
              {/* Columna izquierda — imagen */}
              <figure className='pokeinfo__img'>
                <div className={`pokeinfo__back ${pokemon?.types[0].type.name}`}></div>
                <img className='pokeinfo__normal' src={getSprite()} alt="pokemon image" />
            <div className='pokeinfo__btns'>
              <button className='pokeinfo__shiny-btn' onClick={() => setIsShiny(!isShiny)}>
                {isShiny ? '⬛' : '✨'}
              </button>
              <button className='pokeinfo__gender-btn' onClick={() => setIsMale(!isMale)}>
                {isMale ? '♀' : '♂'}
              </button>
            </div>
              </figure>

              {/* Columna derecha — info */}
              <div className='pokeinfo__info'>
                <h3 className='pokeinfo__num'>#{pokemon?.id}</h3>
                <div className='pokeinfo__info1'>
                  <hr className='pokeinfo__hr'/>
                  <h3 className='pokeinfo__name noshadow'>{pokemon?.name}</h3>
                  <hr className='pokeinfo__hr'/>
                </div>
                <div className='pokeinfo__fisic'>
                  <div className='pokeinfo__height1'>
                    <span className='pokeinfo__span'>height</span>
                    <h2 className='pokeinfo__height noshadow'>{pokemon?.height / 10}m</h2>
                  </div>
                  <div className='pokeinfo__weight1'>
                    <span className='pokeinfo__span'>weight</span>
                    <h2 className='pokeinfo__weight noshadow'>{pokemon?.weight / 10}kg</h2>
                  </div>
                </div>
                <div className='pokeinfo__other'>
                  <div className='pokeinfo__type1'>
                    <span className='pokeinfo__span'>Type:</span>
                    <ul className='pokeinfo__types'>
                      {pokemon?.types.map((type, index) => (
                        <li className={pokemon?.types[index]?.type.name} key={type.type.url}>
                          {type.type.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className='pokeinfo__ability1'>
                    <span className='pokeinfo__span'>abilities:</span>
                    <ul className='pokeinfo__abilities1'>
                      {pokemon?.abilities.map((ability) => (
                        <li className='pokeinfo__abilities' key={ability.ability.url}>
                          {ability.ability.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className='pokeinfo__stats-section'>
              <div className='pokeinfo__title'>
                <span className='noshadow'>stats</span>
                <hr className='pokeinfo__hr hr2'/>
                <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
              </div>
              <ul className='pokeinfo__stats'>
                {pokemon?.stats.map(stat => (
                  <li className='pokeinfo__stats-item' key={stat.stat.url}>
                    <span>{stat.stat.name}</span><span>{stat.base_stat}/250</span>
                    <div className='outbar'>
                      <div className='inbar' style={{width: `${stat.base_stat / 2.5}%`}}></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pokédex Numbers ── */}
          {pokedexLoaded && (
            <div id='num' className='datos1 datos1--full last'>
              <div className='pokeinfo__title'>
                <span className='noshadow'>numbers pokedex</span>
                <hr className='pokeinfo__hr hr2'/>
                <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
              </div>
              <Numbers id={id} />
            </div>
          )}
        </div>
          

        {/* ── Evoluciones, Forms  and moves── */}
        {(evosLoaded || formsLoaded || movesLoaded) && (
        <div id='evo' className='evos__forms'>
          {evosLoaded && (
            <div className='datos1 combinateTop'>
              <div className='pokeinfo__title'>
                <span className='noshadow'>Evolutions chain</span>
                <hr className='pokeinfo__hr hr2'/>
                <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
              </div>
              <div className='pokeinfo__evos'><Evolves species={species} pokemon={pokemon} /></div>
            </div>
          )}
          {formsLoaded && (
            <div id='form' className='datos1 combinateMedium'>
              <div className='pokeinfo__title'>
                <span className='noshadow'>Forms &/or Variants</span>
                <hr className='pokeinfo__hr hr2'/>
                <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
              </div>
              <div className='pokeinfo__evos'><Forms /></div>
            </div>
          )}
          {/* Moves */}
          {movesLoaded && (
            <div id='mov' className='datos1 combinateBottom datos1--full'>
              <div className='pokeinfo__title'>
                <span className='noshadow'>movements</span>
                <hr className='pokeinfo__hr hr2'/>
                <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
              </div>
              <div className='pokeinfo__evos'>
                <Moves id={id} pokemon={pokemon} />
              </div>
            </div>
          )}
        </div>
      )}
        {/* ── Butons ── */}
        {pendingButtons > 0 && (
          <div className='load-btns'>
            {!pokedexLoaded && (
              <a className='moves-button' onClick={() => setPokedexLoaded(true)} href='#num'>
                <div className='pokeball-btn'>
                  <div className='pokeball-btn__top' style={{backgroundImage: `url(${pokeballs[0]})`}}></div>
                  <div className='pokeball-btn__bottom' style={{backgroundImage: `url(${pokeballs[0]})`}}></div>
                  <span className='pokeball-btn-text'>Pokédex</span>
                </div>
              </a>
            )}
            {!evosLoaded && (
              <a className='moves-button' onClick={() => setEvosLoaded(true)} href='#evo'>
                <div className='pokeball-btn'>
                  <div className='pokeball-btn__top' style={{backgroundImage: `url(${pokeballs[1]})`}}></div>
                  <div className='pokeball-btn__bottom' style={{backgroundImage: `url(${pokeballs[1]})`}}></div>
                  <span className='pokeball-btn-text'>Evolutions</span>
                </div>
              </a>
            )}
            {!formsLoaded && (
              <a className='moves-button' onClick={() => setFormsLoaded(true)} href='#form'>
                <div className='pokeball-btn'>
                  <div className='pokeball-btn__top' style={{backgroundImage: `url(${pokeballs[2]})`}}></div>
                  <div className='pokeball-btn__bottom' style={{backgroundImage: `url(${pokeballs[2]})`}}></div>
                  <span className='pokeball-btn-text'>Forms</span>
                </div>
              </a>
            )}
            {!movesLoaded && (
              <a className='moves-button' href='#mov'
                onClick={() => {
                  // solo muestra el contenedor, Moves carga internamente
                  setMovesLoaded(true);
                }}>
                <div className='pokeball-btn'>
                  <div className='pokeball-btn__top' style={{backgroundImage: `url(${pokeballs[3]})`}}></div>
                  <div className='pokeball-btn__bottom' style={{backgroundImage: `url(${pokeballs[3]})`}}></div>
                  <span className='pokeball-btn-text'>Moves</span>
                </div>
              </a>
            )}
            
          </div>
        )}
      </div>
      <PokeFooter/>
    </section>
  )
}

export default PokeInfo;
