const Country = ({countries}) => {
    if (countries.length !== 1) return;
    const country = countries[0];
    
    return (
        <>
            <h1>{country.name.common}</h1>
            <div>
                <p>{country.capital}</p>
                <p>Area {country.area}</p>
            </div>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map((lan, index) =>
                    <li key={index}>{lan}</li>
                )}
            </ul>
            <img src={country.flags.png} alt="flag" />
        </>
    )
}

export default Country