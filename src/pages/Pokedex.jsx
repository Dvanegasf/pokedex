import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import useFetch from '../hooks/useFetch';
import PokeCard from '../components/shared/pokedex/PokeCard';
import PokeSelect from '../components/shared/pokedex/PokeSelect';
import './styles/pokedex.css';
import Pagin from '../components/shared/pokedex/Pagin'
import PokeHeader from '../components/shared/PokeHeader';
import PokeFooter from '../components/shared/PokeFooter';

const Pokedex = () => {

  const trainer = useSelector((store) => store.trainer);
  const [inputValue, setInputValue] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [paginate, setPaginate] = useState(1)

  const [pokemons, getPokemons, getType] = useFetch();


  useEffect(() => {
    if (typeFilter) {
      getType(typeFilter)
    } else {
      const url = 'https://pokeapi.co/api/v2/pokemon/?limit=1302';
    getPokemons(url);
    }
  }, [typeFilter]);

  const textInput = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputValue(textInput.current.value.trim().toLowerCase());
    textInput.current.value = '';
  }

  const cbFilter = (poke) => {
    return poke.name.includes(inputValue);
  }
  const quantity = 12;
  const total = Math.ceil(pokemons?.results.filter(cbFilter).length / quantity);
  const pages = () => {
    const end = quantity * paginate;
    const start = end - quantity;
    return pokemons?.results.filter(cbFilter).slice(start, end);
  }

  return (
    <div className='pokedex'>
      <PokeHeader/>
      <h3 className='pokedex__wave'><span>Welcome {trainer}, </span>here you can find information about any Pokémon.</h3>
      <div className='pokedex__filters1'>
        <form className='pokedex__filters' onSubmit={handleSubmit}>
          <input placeholder='Search for a pokemon' className='pokedex__in' ref={textInput} type="text" />
          <button className='pokedex__btn'>Search</button>
        </form>
        <PokeSelect
        setTypeFilter={setTypeFilter}/>
      </div>
      <div className='pokedex__container'>
      {
          pages()?.map((poke) => (
            <PokeCard
            key={poke.url}
            url={poke.url}
            />
          ))
        }
      </div>
      <div> 
      <Pagin
      paginate={paginate}
      setPaginate={setPaginate}
      total={total}
      />
      </div>
      <PokeFooter/>
    </div>
  )
}

export default Pokedex;