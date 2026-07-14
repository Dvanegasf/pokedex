import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/evolves.css';
import '../pokedex/styles/pokeCard.css';
import { version } from 'react';

const format = (text) =>
  text
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
const fetchPokemon = (name) =>
  axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`).then(r => r.data);

const Evolves = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  
 useEffect(() => {
  setChain([]);
  setLoading(false);
  loadChain(false);
}, [id]);

  const loadChain = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
      const chainRes = await axios.get(species.data.evolution_chain.url);

      console.log(chainRes)
      const flat = [];
      const traverse = (node, stage) => {
        flat.push({
          name: node.species.name,
          details: node.evolution_details,
          stage
        });
        node.evolves_to.forEach(next => traverse(next, stage + 1));
      };
      traverse(chainRes.data.chain, 0);

      const pokeData = await Promise.all(flat.map(e => fetchPokemon(e.name)));

      const result = flat.map((e, i) => ({
        ...e,
        id: pokeData[i].id,
        image: pokeData[i].sprites.other['official-artwork'].front_default,
        type: pokeData[i].types[0].type.name,
        type2: pokeData[i].types[1]?.type.name || null,
        pokeName: pokeData[i].name,
      }));

      setChain(result);
      setLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!loading) return;
  loadChain();
}, [loading]);

  const renderDetail = (details) => {
  if (!details) return null;
  const labels = {
  min_level: 'Level',
  min_happiness: 'Happiness',
  min_affection: 'Affection',
  min_beauty: 'Beauty',
  held_item: 'Hold Item',
  known_move: 'Known Move',
  known_move_type: 'Move Type',
  time_of_day: 'Time',
  trigger: 'Method',
  trade_species: 'Trade With',
  needs_overworld_rain: 'Rain',
  turn_upside_down: 'Turn console Upside Down',
  item: 'Use Item',
  location: 'Location',
  gender: 'Gender',
  relative_physical_stats: 'Attack Comparison',
  near_special_rock: 'Near Special Rock',
  party_species: 'Party Pokémon',
  party_type: 'Party Type',
  used_move: 'Use Move',
  min_steps: 'Steps',
};
  const ignoredFields = [
  'is_default',
  'version_group',
  'base_form',
  'evolved_form',
  'region'
];


  return Object.entries(details)
    .filter(([k, v]) => 
      !ignoredFields.includes(k) && 
     // v !== true && 
      v !== null && 
      v !== false &&
      v !== '')
    .map(([k, v]) => {
      const label = labels[k] || format(k);
      if (v === true) {
        return (
          <span key={k} className="evo__detail">
             {label} ✅
          </span>
        );
      }
      
      let value;

      if (typeof v === 'object') {

        if (k === 'item') {

          value = (
            <div className="evo__item">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${v.name}.png`}
                alt={v.name}
              />
              <p>{format(v.name)}</p>
            </div>
          );

        } else {

          value = format(v.name);

        }

      } else {

        // 👇 Caso especial para Tyrogue
        if (k === 'relative_physical_stats') {

          switch (v) {
            case 1:
            value = 'Attack must be higher than Defense';
            break;

          case 0:
            value = 'Attack and Defense must be equal';
            break;

          case -1:
            value = 'Defense must be higher than Attack';
            break;
          }

        } else {

          value = format(String(v));

        }

      }
      
      return (
        <span key={k} className='evo__detail'>
          <strong>{label}:</strong> {value}
        </span>
      );
    });
  yy};

  const stages = [...new Set(chain.map(e => e.stage))];

  
  return (
    <div className='evo__cont'>
      
      {loading && <p className='evo__loading'>Loading evolutions...</p>}
      {loaded && stages.map(stage => (
        <div key={stage} className='evo__stage'>
          {stage > 0 && <div className='evo__arrow'>↓</div>}
          <div className='evo__row'>
            {chain.filter(e => e.stage === stage).map(evo => (
              <div
                key={evo.name}
                className={`evo__card ${evo.type}`}
                onClick={() => navigate(`/pokedex/${evo.pokeName}`)}
              >
                <span className='evo__num'>#{evo.id}</span>
                <img className='evo__img' src={evo.image} alt={evo.name} />
                <div className='evo__name'>
                  <span>{evo.name}</span>
                </div>
                <li className='Types__li'>
                  <span className={`slot__1 ${evo.type}`}>{evo.type}</span>
                  {evo.type2 && <span className={`slot__2 ${evo.type2}`}>{evo.type2}</span>}
                </li>
                {evo.details && (
                  <div className="evo__details">

                    {evo.details.length > 1 ? (
                      <details className="evo__games"
                      onClick={(e) => e.stopPropagation()}>
                        <summary>
                          Show evolution methods ({evo.details.length} games)
                        </summary>

                        {evo.details.map((detail, index) => (
                          <div key={index} className="evo__method">
                            <h4>{format(detail.version_group.name)}</h4>

                            {renderDetail(detail)}
                          </div>
                        ))}
                      </details>
                    ) : (
                      evo.details.map((detail, index) => (
                        <div key={index} className="evo__method">
                          <h4>{format(detail.version_group.name)}</h4>

                          {renderDetail(detail)}
                        </div>
                      ))
                    )}

                  </div>
)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Evolves;