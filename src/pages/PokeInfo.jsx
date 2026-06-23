import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import './styles/pokeInfo.css';
import axios from 'axios';
import PokeHeader from '../components/shared/PokeHeader';
import Evolves from '../components/shared/pokedex/Evolves';
import PokeFooter from '../components/shared/PokeFooter';
import Forms from '../components/shared/pokedex/Forms';
import '../components/shared/pokedex/styles/pokeCard.css'

const PokeInfo = () => {

  const [pokemon, getPokemon] = useFetch();
  const [species, getSpecies] = useFetch();
  const [movesData, setMovesData] = useState([]);
  const { id } = useParams();
  const [movesLoaded, setMovesLoaded] = useState(false);
  const [loadingMoves, setLoadingMoves] = useState(false);
  const [evosLoaded, setEvosLoaded] = useState(false);
  const [formsLoaded, setFormsLoaded] = useState(false);
  const [pokedexLoaded, setPokedexLoaded] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [isMale, setIsMale] = useState(true);

  
  useEffect(() => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const url2 = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    
    getPokemon(url);
    getSpecies(url2);
    
    
    window.scrollTo(0, 0); 
    setMovesData([]);
    setMovesLoaded(false);
    setLoadingMoves(false);
    setFormsLoaded(false);
    setEvosLoaded(false);
    setPokedexLoaded(false);
    setIsShiny(false);
    setIsMale(true);

    
  }, [id]);
  
  const formatName = (str) => {
    return str
    .replaceAll('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const loadMoves = async () => {
    
    if (movesLoaded || !pokemon?.moves) return;
    
    setLoadingMoves(true); 
    
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
  const getSprite = () => {
  const sprites = pokemon?.sprites.other['home'];
  if (isShiny && isMale) return sprites?.front_shiny;
  if (isShiny && !isMale) return sprites?.front_shiny_female || sprites?.front_shiny;
  if (!isShiny && !isMale) return sprites?.front_female || sprites?.front_default;
  return sprites?.front_default;
};
  const pokedexNames = {
  'national': 'National',
  'kanto': 'Kanto (Red / Blue / Yellow)',
  'original-johto': 'Johto (Gold / Silver / Crystal)',
  'updated-johto': 'Johto (HeartGold / SoulSilver)',
  'hoenn': 'Hoenn (Ruby / Sapphire / Emerald)',
  'updated-hoenn': 'Hoenn (Omega Ruby / Alpha Sapphire)',
  'original-sinnoh': 'Sinnoh (Diamond / Pearl)',
  'extended-sinnoh': 'Sinnoh (Platinum)',
  'updated-unova': 'Unova (Black / White)',
  'original-unova': 'Unova (Black 2 / White 2)',
  'conquest-gallery': 'Pokémon Conquest',
  'kalos-central': 'Kalos Central (X / Y)',
  'kalos-coastal': 'Kalos Coastal (X / Y)',
  'kalos-mountain': 'Kalos Mountain (X / Y)',
  'updated-kalos': 'Kalos Updated',
  'alola-melemele': 'Alola Melemele (Sun / Moon)',
  'alola-akala': 'Alola Akala (Sun / Moon)',
  'alola-ulaula': 'Alola Ulaula (Sun / Moon)',
  'alola-poni': 'Alola Poni (Sun / Moon)',
  'updated-alola': 'Alola (Ultra Sun / Ultra Moon)',
  'updated-melemele': 'Melemele (Ultra Sun / Ultra Moon)',
  'updated-akala': 'Akala (Ultra Sun / Ultra Moon)',
  'updated-ulaula': 'Ulaula (Ultra Sun / Ultra Moon)',
  'updated-poni': 'Poni (Ultra Sun / Ultra Moon)',
  'letsgo-kanto': "Kanto (Let's Go Pikachu / Eevee)",
  'galar': 'Galar (Sword / Shield)',
  'isle-of-armor': 'Isle of Armor (Sword / Shield)',
  'crown-tundra': 'Crown Tundra (Sword / Shield)',
  'hisui': 'Hisui (Legends: Arceus)',
  'paldea': 'Paldea (Scarlet / Violet)',
  'kitakami': 'Kitakami (Scarlet / Violet DLC)',
  'blueberry': 'Blueberry (Scarlet / Violet DLC)',
  'lumiose-city': 'Lumiose City (X / Y)',
};
  
console.log(pokemon)
  return (
    <section className='pokeinfo'>
      <PokeHeader/>
      <div className='pokeinfo__contP'>
          <div className='pokeinfo__cont'>
            <div className='pokeinfo__btns'>
              <button className='pokeinfo__shiny-btn' onClick={() => setIsShiny(!isShiny)}>
                {isShiny ? '⬛' : '✨'}
              </button>
              <button className='pokeinfo__gender-btn' onClick={() => setIsMale(!isMale)}>
                  {isMale ? '♀' : '♂'}
              </button>
            </div>
            <div className='pokeinfo__top'>
            {/* Columna izquierda — imagen */}
            <figure className='pokeinfo__img'>
              <div className={`pokeinfo__back ${pokemon?.types[0].type.name}`}></div>
              <img
                className='pokeinfo__normal'
                src={getSprite()}
                alt="pokemon image"
              />
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

          {/* Stats — ancho completo debajo del grid */}
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

        <div className='evos__forms'>
          {/* ── Evoluciones ── */}
          {!evosLoaded
            ? <button className='moves-button' onClick={() => setEvosLoaded(true)}>Click to Load Evolutions</button>
            : <div className='datos1 combinatetop'>
                <div className='pokeinfo__title'>
                  <span className='noshadow'>Evolutions chain</span>
                  <hr className='pokeinfo__hr hr2'/>
                  <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
                </div>
                <div className='pokeinfo__evos'><Evolves /></div>
              </div>
          }

          {/* ── Forms ── */}
          {!formsLoaded
            ? <button className='moves-button' onClick={() => setFormsLoaded(true)}>Click to Load Forms & Variants</button>
            : <div className='datos1 combinatebottom'>
                <div className='pokeinfo__title'>
                  <span className='noshadow'>Forms &/or Variants</span>
                  <hr className='pokeinfo__hr hr2'/>
                  <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
                </div>
                <div className='pokeinfo__evos'><Forms /></div>
              </div>
          }
        </div>
        {/* ── Movimientos — ocupa 2 columnas ── */}
        {!movesLoaded && !loadingMoves
          ? <button className='moves-button' onClick={loadMoves}>Click to Load Moves</button>
          : <div className='datos1'>
              <div className='pokeinfo__title'>
                <span className='noshadow'>movements</span>
                <hr className='pokeinfo__hr hr2'/>
                <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
              </div>
              {loadingMoves && <p>Loading moves...</p>}
              {movesLoaded && (
                <div className='moves-container'>
                  {Object.entries(groupedMoves).map(([method, moves]) => (
                    <details key={method}>
                      <summary className='moves-method'>{formatName(method)}</summary>
                      {Object.values(moves).map(({ move, details }) => (
                        <details key={move.id} className='move-card'>
                          <summary className='noshadow'>{formatName(move.name)}</summary>
                          <div className='move-info'>
                            <div className='move-info-data'>
                              <div className='move-badges'>
                                <p><strong className='noshadow'>Category:</strong></p>
                                <span className='badge badge-category'>{move.damage_class.name}</span>
                              </div>
                              <p><strong className='noshadow'>Type:</strong> <span className={`badge ${move.type.name}`}>{move.type.name}</span></p>
                              <p><strong className='noshadow'>Power:</strong> {move.power ?? '--'}</p>
                              <p><strong className='noshadow'>Accuracy:</strong> {move.accuracy ?? '--'}</p>
                              <p><strong className='noshadow'>PP:</strong> {move.pp ?? '--'}</p>
                              <p><strong className='noshadow'>Contest:</strong> <span className={`badge ${move.contest_type?.name}`}>{move.contest_type?.name ?? '--'}</span></p>
                              <ul>
                                <p><strong className='noshadow'>Version Availability</strong></p>
                                {details.map((detail, index) => (
                                  <li key={index}>
                                    {detail.version_group.name}
                                    {method === 'level-up' ? ` (Lv. ${detail.level_learned_at})` : ''}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className='move-flavor'>
                              <p className='noshadow'>Description</p>
                              <p>{move?.flavor_text_entries?.[0]?.flavor_text}</p>
                            </div>
                          </div>
                        </details>
                      ))}
                    </details>
                  ))}
                </div>
              )}
            </div>
        }

         {/* ── Números Pokédex — ocupa 2 columnas ── */}
        {!pokedexLoaded
          ? <button className='moves-button datos1--full' onClick={() => setPokedexLoaded(true)}>Click to Load Pokédex Numbers</button>
          : <div className='datos1 datos1--full last'>
              <div className='pokeinfo__title'>
                <span className='noshadow'>numbers pokedex</span>
                <hr className='pokeinfo__hr hr2'/>
                <figure><img className='pokeinfo__img2' src="../../../assets/pokebola.png" alt="pokebola image" /></figure>
              </div>
              <div className='pokeinfo__games1'>
                {species?.pokedex_numbers.map((pokedex) => (
                  <li className='pokeinfo__games' key={pokedex.pokedex.name}>
                    <p>{pokedexNames[pokedex.pokedex.name] || pokedex.pokedex.name.replaceAll('-', ' ')}</p>
                    <p>#{pokedex.entry_number}</p>
                  </li>
                ))}
              </div>
            </div>
        }

      </div>
      <PokeFooter/>
    </section>
  )
}

export default PokeInfo;