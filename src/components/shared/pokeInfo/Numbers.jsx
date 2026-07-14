import React, { useEffect } from 'react'
import useFetch from '../../../hooks/useFetch';
import './styles/numbers.css'

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

const Numbers = ({id}) => {
    
    const [species, getSpecies] = useFetch();
    
    useEffect(() => {
        getSpecies(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    }, [id]);

    if (!species) return <p>Loading...</p>;
    //console.log(species)

  return (
    <div className='numbers'>
        {species?.pokedex_numbers.map((pokedex) => (
            <li className='numbers__pokedex' key={pokedex.pokedex.name}>
                <p>{pokedexNames[pokedex.pokedex.name] || pokedex.pokedex.name.replaceAll('-', ' ')}</p>
                <p>#{pokedex.entry_number}</p>
            </li>
        ))}
    </div>
  )
}
[]
export default Numbers