import React, { useEffect, useRef } from 'react'
import { setTrainer } from '../store/slices/trainer.slice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../components/shared/pokedex/styles/pokeCard.css'
import './styles/homePage.css'
import PokeHeader from '../components/shared/PokeHeader';
import PokeFooter from '../components/shared/PokeFooter';

const HomePage = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const textInput = useRef()
  const trainer = useSelector((store) => store.trainer)

  useEffect(() => {
    if (trainer) {
      navigate('/pokedex')
    }
  }, [trainer])

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = textInput.current.value.trim()
    if (!name) return
    dispatch(setTrainer(name))
    textInput.current.value = ''
    navigate('/pokedex')
  }

  return (
    <div className='pokehome'>
      <PokeHeader/>
      <div>
        <figure className='pokehome__img'>
          <img src="../../../assets/pokedex.png" alt="pokedex image" />
        </figure>
        <h2 className='pokehome__hi'>Hi trainer!</h2>
        <p className='pokehome__text'>To start, give me your name</p>
        <form className='pokehome__form' onSubmit={handleSubmit}>
          <input placeholder='Your name' className='pokehome__in' ref={textInput} type="text" />
          <button className='pokehome__btn'>Start</button>
        </form>
      </div>
      <PokeFooter/>
    </div>
  )
}

export default HomePage;