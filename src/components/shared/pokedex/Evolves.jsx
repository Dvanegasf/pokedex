import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/evolves.css';
import './styles/pokeCard.css';

const fetchPokemon = (name) =>
  axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`).then(r => r.data);

const Evolves = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chain, setChain] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setChain([]);
    setLoading(true);

    const load = async () => {
      try {
        // 1. especie → cadena
        const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        const chainRes = await axios.get(species.data.evolution_chain.url);

        // 2. aplanar la cadena en un array plano con stage
        const flat = [];
        const traverse = (node, stage) => {
          flat.push({ name: node.species.name, details: node.evolution_details[0] || null, stage });
          node.evolves_to.forEach(next => traverse(next, stage + 1));
        };
        traverse(chainRes.data.chain, 0);

        // 3. fetch de todos los pokemon a la vez
        const pokeData = await Promise.all(flat.map(e => fetchPokemon(e.name)));

        const result = flat.map((e, i) => ({
          ...e,
          id: pokeData[i].id,
          image: pokeData[i].sprites.other['official-artwork'].front_default,
          type: pokeData[i].types[0].type.name,
          type2: pokeData[i].types[1].type.name,
          pokeName: pokeData[i].name,
        }));

        setChain(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const renderDetail = (details) => {
    if (!details) return null;
    const labels = {
      min_level: 'Level', 
      min_happiness: 'Happiness',
      min_affection: 'Affection',
      min_beauty: 'Beauty', 
      held_item: 'Hold item', 
      known_move: 'Move',
      known_move_type: 'Move type',
      time_of_day: 'Time', 
      trigger: 'Method',
      trade_species: 'Trade with', 
      needs_overworld_rain: 'Rain',
      turn_upside_down: 'Upside down', 
      item: 'Use item',
    };
    return Object.entries(details)
      .filter(([, v]) => v !== null && v !== false && v !== '')
      .map(([k, v]) => {
        const label = labels[k] || k;
        const value = typeof v === 'object' ? v.name?.replaceAll('-', ' ') : v.toString().replaceAll('-', ' ');
        return <span key={k} className='evo__detail'><strong>{label}:</strong> {value}</span>;
      });
  };

  if (loading) return <p className='evo__loading'>Loading evolutions...</p>;

  // agrupar por stage
  const stages = [...new Set(chain.map(e => e.stage))];
console.log(chain)
  return (
    <div className='evo__cont'>
      {stages.map(stage => (
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
                    <span className={`slot__2 ${evo.type2}`}>{evo.type2}</span>  
                  </li>

                {evo.details && (
                  <div className='evo__details'>
                    {renderDetail(evo.details)}
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