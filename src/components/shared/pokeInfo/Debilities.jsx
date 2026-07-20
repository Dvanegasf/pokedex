import React from 'react'
import './styles/debilities.css'

const Debilities = ({ types, alltypes }) => {


  const calcDamageRelations = () => {
    if (!types?.length) return {};

    const multipliers = {};

    types.forEach(type => {
      const dr = type.damage_relations;

      dr.double_damage_from.forEach(t => {
        multipliers[t.name] = (multipliers[t.name] || 1) * 2;
      });
      dr.half_damage_from.forEach(t => {
        multipliers[t.name] = (multipliers[t.name] || 1) * 0.5;
      });
      dr.no_damage_from.forEach(t => {
        multipliers[t.name] = 0;
      });
    });

    return multipliers;
  };

  const multipliers = calcDamageRelations();

  // separar por categoría según el multiplicador final
  const x4    = Object.entries(multipliers).filter(([, v]) => v === 4);
  const x2    = Object.entries(multipliers).filter(([, v]) => v === 2);


  const typesInMultipliers = Object.keys(multipliers);
  const allTypeNames = alltypes?.results
    ?.filter(t => !['unknown', 'stellar'].includes(t.name))
    ?.map(t => t.name) || [];

  // los que no aparecen en multipliers son x1 (daño normal)
  const missingAsX1 = allTypeNames
    .filter(name => !typesInMultipliers.includes(name))
    .map(name => [name, 1]);

  // los que sí están en multipliers y son exactamente 1
  const inMultipliersX1 = Object.entries(multipliers).filter(([, v]) => v === 1);

  const x1 = [...inMultipliersX1, ...missingAsX1];


  const x05   = Object.entries(multipliers).filter(([, v]) => v === 0.5);
  const x025  = Object.entries(multipliers).filter(([, v]) => v === 0.25);
  const x0    = Object.entries(multipliers).filter(([, v]) => v === 0);

  const renderGroup = (label, items) => {
    if (!items.length) return null;
    return (
      <div className='cont__types'>
        <h4>{label}</h4>
        <ul className='types'>
          {items.map(([name]) => (
            <li key={name} className={name}>{name}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div >
      {renderGroup('Super weak (x4) 🔥', x4)}
      {renderGroup('Weak (x2)', x2)}
      {renderGroup('Normal (x1)', x1)}
      {renderGroup('Resistant (x0.5)', x05)}
      {renderGroup('Very resistant (x0.25)', x025)}
      {renderGroup('Immune (x0)', x0)}
    </div>
  );
};

export default Debilities;