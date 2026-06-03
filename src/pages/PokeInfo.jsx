import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Evolves from '../components/shared/pokedex/Evolves';
import '../components/shared/pokedex/styles/pokeCard.css'
import './styles/pokeInfo.css';
import axios from 'axios';
import PokeHeader from '../components/shared/PokeHeader';
import PokeFooter from '../components/shared/PokeFooter';

const PokeInfo = () => {

  const [pokemon, getPokemon] = useFetch();
  const [movesData, setMovesData] = useState([]);
  const { id } = useParams();
  const [movesLoaded, setMovesLoaded] = useState(false);
  const [loadingMoves, setLoadingMoves] = useState(false);

  const loadMoves = async () => {

    if (movesLoaded || !pokemon?.moves) return;
    console.log("Se salió por el if");
    
    setLoadingMoves(true); // <-- falta esto

    try {
      const urls = pokemon.moves.map(move => move.move.url);

      const responses = await Promise.all(
        urls.map(url => axios.get(url))
      );

      const moves = responses.map(res => res.data);

      setMovesData(moves);
      setMovesLoaded(true);

    } catch (err) {
      console.log(err);
    } finally {
      setLoadingMoves(false);
    }
  };


  const groupedMoves = {};

  movesData.forEach(move => {

    const pokemonMove = pokemon?.moves.find(
      m => m.move.name === move.name
    );

    pokemonMove?.version_group_details.forEach(detail => {

      const method = detail.move_learn_method.name;

      if (!groupedMoves[method]) {
        groupedMoves[method] = {};
      }

      if (!groupedMoves[method][move.name]) {
        groupedMoves[method][move.name] = {
          move,
          details: []
        };
      }

      groupedMoves[method][move.name].details.push(detail);

    });

  });


  useEffect(() => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    getPokemon(url);

    setMovesData([]);
    setMovesLoaded(false);
    setLoadingMoves(false);

  }, [id]);

  const formatName = (str) => {
    return str
      .replaceAll('-', ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <section className='pokeinfo'>
      <PokeHeader/>
      <div className='pokeinfo__cont'>       
        <figure className='pokeinfo__img'>
         <div className={`pokeinfo__back ${pokemon?.types[0].type.name}`}></div>

            <img className='pokeinfo__normal'src={pokemon?.sprites.other['official-artwork'].front_default} alt="pokemon image" />

            <img loading="lazy" className='pokeinfo__shiny' src={pokemon?.sprites.other['official-artwork'].front_shiny} alt="pokemon shiny image" /> <p>✨</p>
          </figure>
        <div className='pokeinfo__info'>
            <h3 className={`pokeinfo__num ${pokemon?.types[0].type.name}`}>
              #{pokemon?.id}</h3>
          <div className='pokeinfo__info1'>
            <hr className='pokeinfo__hr'/>
            <h3 className={`pokeinfo__name ${pokemon?.types[0].type.name}`}> {pokemon?.name}  </h3>
            <hr className='pokeinfo__hr' />
          </div>
          <div className='pokeinfo__fisic'>
            <div className='pokeinfo__height1'>
              <span className='pokeinfo__span'>height</span>
              <h2 className='pokeinfo__height'>{pokemon?.height/ 10}m</h2>
            </div>
            <div className='pokeinfo__weight1'> 
              <span className='pokeinfo__span'>weight</span>
              <h2 className='pokeinfo__weight'>{pokemon?.weight/10}kg</h2>
            </div>
          </div>
          <div className='pokeinfo__other'>
            <div className='pokeinfo__type1'>
              <span className='pokeinfo__span'>Type:</span>
              <ul className='pokeinfo__types'>
                  {
                    pokemon?.types.map((type, index) => (
                    <li className={`slot__${type.slot} ${pokemon?.types[index]?.type.name}`} key={type.type.url}>
                      {type.type.name} 
                    </li>
                      ))
                  }
              </ul>
            </div>
            <div className='pokeinfo__ability1'>
              <span className='pokeinfo__span'>abilities:</span>
              <ul className='pokeinfo__abilities1'>
                {
                  pokemon?.abilities.map((ability, index) => (
                  <li className='pokeinfo__abilities' key={ability.ability.url}>
                    {ability.ability.name} 
                  </li>
                    ))
                }
              </ul>
            </div>

          </div>
        </div>
        <div className='pokeinfo__title'>
          <span>stats</span>
          <hr className='pokeinfo__hr hr2'/>
          <figure>
            <img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" />
          </figure>
        </div>
        <ul className='pokeinfo__stats'>
        {
          pokemon?.stats.map(stat => (
            <li className='pokeinfo__stats-item' key={stat.stat.url}>
              <span>{stat.stat.name}</span><span>{stat.base_stat}/250</span>
              <div className='outbar'>
                <div className='inbar' style={{width: `${stat.base_stat/2.5}%`}}></div>
              </div>
            </li>
          ))
        }
        </ul>
      </div>
      <div className='pokeinfo__cont datos1'>
        <div className='pokeinfo__title'>
            <span>Evolutions chain</span>
            <hr className='pokeinfo__hr hr2'/>
            <figure>
              <img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" />
            </figure>
        </div>
        <div className='pokeinfo__evos'> 
            <Evolves/>
        </div>
      </div>
      
      <details
        className='pokeinfo__cont datos1'>
        <summary className='pokeinfo__title'>
          <span>movements</span>
            <hr className='pokeinfo__hr hr2'/>
            <figure>
              <img className='pokeinfo__img2' src="../../../assets/pokebolaME.png" alt="pokebola image" />
            </figure>
        </summary>

        {
          !movesLoaded && !loadingMoves && (
            <button onClick={loadMoves}>
              Load Moves
            </button>
          )
        }
        {
          loadingMoves ? (
            <p>Loading moves...</p>
          ) : movesLoaded ? (
            <div className='moves-container'>
            {
              Object.entries(groupedMoves).map(
                ([method, moves]) => (

                  <details key={method}>

                    <summary>
                      {formatName(method)}
                    </summary>

                    {
                      Object.values(moves).map(
                        ({ move, details }) => (

                          <details
                            key={move.id}
                            className='move-card'
                          >
                            <p>
                              Category: {move.damage_class.name}
                            </p>

                            <summary>
                              {move.name}
                            </summary>

                            <div>

                              <p>
                                Type: {move.type.name}
                              </p>

                              <p>
                                Power: {move.power ?? '--'}
                              </p>

                              <p>
                                Accuracy: {move.accuracy ?? '--'}
                              </p>

                              <ul>

                                {
                                  details.map((detail, index) => (

                                    <li key={index}>

                                      {detail.version_group.name}

                                      {
                                        method === 'level-up'
                                          ? ` (Lv. ${detail.level_learned_at})`
                                          : ''
                                      }

                                    </li>

                                  ))
                                }

                              </ul>

                            </div>

                          </details>

                        )
                      )
                    }

                  </details>

                )
              )
            }

          </div>
          ) : (
            <p>No moves loaded.</p>
          )
        }

      </details>
      <div className='pokeinfo__cont datos1 last'>
        <div className='pokeinfo__title'>
            <span>appears games</span>
            <hr className='pokeinfo__hr hr2'/>
            <figure>
              <img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" />
            </figure>
        </div>
        <div className='pokeinfo__games1'> 
          {
              pokemon?.game_indices.map(game => (
              <li className='pokeinfo__games' key={game.version.url}>
                {game.version.name} 
              </li>
              ))
            }
        </div>
      </div>
      <PokeFooter/>
    </section>
    
  )
}

export default PokeInfo;