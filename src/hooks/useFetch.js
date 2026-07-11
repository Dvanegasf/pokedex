import axios from "axios"
import { useState } from "react"


const useFetch = () => {
  const [apiData, setApiData] = useState()
  const getApi = (url) => {
  setTimeout(() => {
    axios.get(url)
      .then(res => setApiData(res.data))
      .catch(err => console.log(err));
  }, Math.random() * 500); // delay random entre 0 y 500ms
}
  const getType = (url) => {
    axios.get(url)
    .then(res => setApiData({
      results: res.data.pokemon.map(
        (poke) => poke.pokemon
      )
    }))
    .catch(err => console.log(err));
  }
  
  return [ apiData, getApi, getType ]
}

export default useFetch