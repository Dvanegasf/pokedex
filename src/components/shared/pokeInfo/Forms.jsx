import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/evolves.css';
import '../pokedex/styles/pokeCard.css';

const Forms = ({species}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formsByPoke, setFormsByPoke] = useState([]); // [{ baseName, forms[] }]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFormsByPoke([]);
    setLoading(true);

    const load = async () => {
      try {
        // 1. obtener cadena evolutiva
        const chainRes = await axios.get(species.evolution_chain.url);

        // 2. aplanar cadena para obtener nombres
        const chainNames = [];
        const traverse = (node) => {
          chainNames.push(node.species.name);
          node.evolves_to.forEach(next => traverse(next));
        };
        console.log(species)
        traverse(chainRes.data.chain);

        // 3. por cada pokemon de la cadena buscar sus variedades
        const results = await Promise.all(
          chainNames.map(async (name) => {
            const sp = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}/`);
            if (sp.data.varieties.length <= 1) return null;
            const vars = await Promise.all(
              sp.data.varieties
                .filter(v => !v.is_default)
                .map(v => axios.get(v.pokemon.url).then(r => r.data))
            );

            return {
              baseName: name,
              forms: vars.map(v => ({
                name: v.name,
                id: v.id,
                image: v.sprites.other['official-artwork'].front_default,
                type: v.types[0].type.name,
              }))
            };
          })
        );

        setFormsByPoke(results.filter(Boolean));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p className='evo__loading'>Loading forms...</p>;
  if (formsByPoke.length === 0) return <p className='evo__loading'>No alternate forms.</p>;

  return (
    <div className='evo__cont'>
      {formsByPoke.map(({ baseName, forms }) => (
        <div key={baseName} className='evo__stage2'>
          <span className='evo__varieties-label'>{baseName} forms</span>
          <div className='evo__row'>
            {forms.map(form => (
              <div
                key={form.name}
                className={`evo__card  ${form.type}`}
              >
                <img className='evo__img' src={form.image} alt={form.name} />
                <div className='evo__name'>
                  <span >{form.name.replaceAll('-', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forms;