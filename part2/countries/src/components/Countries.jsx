
const Countries = ({countries, setCountries}) => {
    if (countries.length > 10 || countries.length <= 1) return;

    return (
        <ul>
            {countries.map(country => 
                <SimplifiedCountry country={country} key={country.name.official} setCountries={setCountries}/>
            )}
        </ul>
    )
}

const SimplifiedCountry = ({country, setCountries}) => {
    const onShowCountry = () => {
        setCountries([country]);
    }

    return (
        <li>{country.name.common} <button onClick={onShowCountry}>Show</button></li> 
    )
}

export default Countries