import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './styles/moves.css'

const formatName = (str) => {
  return str
    .replaceAll('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const Moves = ({id, pokemon, onLoad }) => {
    const [movesLoaded, setMovesLoaded] = useState(false);
    const [movesData, setMovesData] = useState([]);
    const [loadingMoves, setLoadingMoves] = useState(false);
    
    useEffect(() => {
        setMovesLoaded(false);
        setMovesData([]);
        setLoadingMoves(false);
    }, [id]); 


    useEffect(() => {
        if (pokemon?.moves) {
            loadMoves();
        }
    }, [pokemon]);

   const loadMoves = async () => {
    if (movesLoaded || !pokemon?.moves) return;
    setLoadingMoves(true);
    try {
      const urls = pokemon.moves.map(move => move.move.url);
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      const moves = responses.map(res => res.data);
      setMovesData(moves);
      setMovesLoaded(true);
      onLoad?.();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingMoves(false);
    }
  };

  const groupedMoves = {};
  movesData.forEach(move => {
    const pokemonMove = pokemon?.moves.find(m => m.move.name === move.name);
    pokemonMove?.version_group_details.forEach(detail => {
      const method = detail.move_learn_method.name;
      if (!groupedMoves[method]) groupedMoves[method] = {};
      if (!groupedMoves[method][move.name]) groupedMoves[method][move.name] = { move, details: [] };
      groupedMoves[method][move.name].details.push(detail);
    });
  });
  return (
    <div>
        {loadingMoves && <p>Loading moves...</p>}
        {movesLoaded && (
            <div className='moves__container'>
            {Object.entries(groupedMoves).map(([method, moves]) => (
                <details key={method}>
                <summary className='moves__method'>{formatName(method)}</summary>
                {Object.values(moves).map(({ move, details }) => (
                    <details key={move.id} className='move__card'>
                    <summary className='noshadow'>{formatName(move.name)}</summary>
                    <div className='move__info'>
                        <div className='move__infodata'>
                        <div className='move__infos'>
                            <div className='move__infos2'>
                            <div className='move__badges'>
                                <p><strong className='noshadow'>Category:</strong></p>
                                <span className={`badge ${move.damage_class.name}`}>{move.damage_class.name}</span>
                            </div>
                            <p><strong className='noshadow'>Type:</strong> <span className={`badge ${move.type.name}`}>{move.type.name}</span></p>
                            <p><strong className='noshadow'>Contest:</strong> <span className={`badge ${move.contest_type?.name}`}>{move.contest_type?.name ?? '--'}</span></p>
                            </div>
                            <div className='move__infos2'>
                            <p><strong className='noshadow'>Power:</strong> {move.power ?? '--'}</p>
                            <p><strong className='noshadow'>PP:</strong> {move.pp ?? '--'}</p>
                            <p><strong className='noshadow'>Accuracy:</strong> {move.accuracy ?? '--'}</p>
                            </div>
                        </div>
                        <ul>
                            <p><strong className='noshadow'>Version Availability</strong></p>
                            {details.map((detail, index) => (
                            <li key={index}>
                                {detail.version_group.name.replaceAll('-', ', ')}
                                {method === 'level-up' ? ` (Lv. ${detail.level_learned_at})` : ''}
                            </li>
                            ))}
                        </ul>
                        </div>
                        <div className='move__flavor'>
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
  )
}



export default Moves