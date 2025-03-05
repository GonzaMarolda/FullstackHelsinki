import { useState } from 'react'
import CountryService from './components/services/CountryService';
import Countries from './components/Countries';
import Country from './components/Country';

function App() {
  const [countries, setCountries] = useState([]);
  const [nameFilter, setNameFilter] = useState('');

  const handleNameFilter = (event) => {
    setNameFilter(event.target.value);
    CountryService
      .getAll()
      .then(countries => 
        setCountries(countries.filter(c => c.name.common.toLowerCase().startsWith(event.target.value.toLowerCase())))
      )
  }

  return (
    <>
      <div>find countries <input value={nameFilter} onChange={handleNameFilter} /></div>
      <FilterWarning countriesLength={countries.length}/>
      <Countries countries={countries} setCountries={setCountries}/>
      <Country countries={countries}/>
    </>
  )
}

const FilterWarning = ({countriesLength}) => {
  if (countriesLength > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
 
}

export default App
