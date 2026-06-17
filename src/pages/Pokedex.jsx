import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setPaginate } from '../store/slices/pokedex.slice';
import useFetch from '../hooks/useFetch';
import PokeCard from '../components/shared/pokedex/PokeCard';
import PokeSelect from '../components/shared/pokedex/PokeSelect';
import './styles/pokedex.css';
import Pagin from '../components/shared/pokedex/Pagin'
import PokeHeader from '../components/shared/PokeHeader';
import PokeFooter from '../components/shared/PokeFooter';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { clearTrainer } from '../store/slices/trainer.slice';
import { useNavigate } from 'react-router-dom';

const Pokedex = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const trainer = useSelector((store) => store.trainer);
  const paginate = useSelector((store) => store.pokedex.paginate);

  const [inputValue, setInputValue] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [pokemons, getPokemons, getType] = useFetch();

  useEffect(() => {
    if (typeFilter) {
      getType(typeFilter)
    } else {
      getPokemons('https://pokeapi.co/api/v2/pokemon/?limit=1025');
    }
  }, [typeFilter]);

  const textInput = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputValue(textInput.current.value.trim().toLowerCase());
    textInput.current.value = '';
  }
  //console.log(pokemons?.results)

  const handleChangeName = () => {
    dispatch(clearTrainer())
    navigate('/')
  }

  const cbFilter = (poke) => poke.name.includes(inputValue);

  const quantity = 12;
  const filtered = pokemons?.results.filter(cbFilter) || [];
  const total = Math.ceil(filtered.length / quantity);

  const pages = () => {
    const end = quantity * paginate;
    const start = end - quantity;
    return filtered.slice(start, end);
  }

  return (
    <div className='pokedex'>
      <PokeHeader/>
      <div className='pokedex__filters1'>
        <form className='pokedex__filters' onSubmit={handleSubmit}>
          <input placeholder='Search for a pokemon' className='pokedex__in' ref={textInput} type="text" />
          <button className='pokedex__btn'>Search</button>
          <div className='pokedex__filters2'>
            <h3 className='pokedex__wave'>
              <span>Welcome {trainer}, </span>here you can find information about any Pokémon.
              <button onClick={handleChangeName} className='pokedex__change-name'>Change name</button>
            </h3>
            <PokeSelect setTypeFilter={setTypeFilter}/>
          </div>
        </form>
      </div>
      <div className='pokedex__container'>
        {pages()?.map((poke) => (
          <PokeCard key={poke.url} url={poke.url} />
        ))}
      </div>
      <Pagin
        paginate={paginate}
        setPaginate={(page) => dispatch(setPaginate(page))}
        total={total}
      />
      <PokeFooter/>
    </div>
  )
}

export default Pokedex;