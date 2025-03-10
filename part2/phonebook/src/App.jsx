import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react';
import PersonService from './components/services/PersonService';

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newNameFilter, setNewNameFilter] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    PersonService
      .getAll()
      .then(persons => {
        setPersons(persons);
      })
  },[]);

  const handleNameChange = (event) => setNewName(event.target.value); 
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleNameFilter = (event) => setNewNameFilter(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.map(person => person.name).includes(newName)) {
      if (!window.confirm(newName + " is already added to phonebook, replace the old number with a new one?")) return;
      
      const personToUpdate = persons.find(p => p.name === newName);
      PersonService
        .update(personToUpdate.id, {...personToUpdate, number: newNumber})
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id !== updatedPerson.id ? p : updatedPerson))
          setConfirmationMessage(`Person '${newName}' had his number modified to '${newNumber}'`)
          setTimeout(() => {setConfirmationMessage(null)}, 4000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {setErrorMessage(null)}, 4000)
        })
    }

    const personObject = {
      name: newName,
      number: newNumbers
    }
    PersonService
      .create(personObject)
      .then(newPerson => setPersons(persons.concat(newPerson)));

    setConfirmationMessage(`Person '${newName}' was added`)
    setTimeout(() => {setConfirmationMessage(null)}, 5000)
  }

  const deletePerson = (person) => {
    if (!window.confirm("Delete " + person.name + "?")) return;

    PersonService
      .remove(person.id)
      .then(delPerson => setPersons(persons.filter(p => p.id !== person.id)))
  }

  return (
    <div>
      <Notification message={confirmationMessage} />
      <Error message={errorMessage} />
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
      <Filter newNameFilter={newNameFilter} handleNameFilter={handleNameFilter}/>
      <AddPerson 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}/>
      </form>
      <Persons persons={persons} newNameFilter={newNameFilter} deletePerson={(person) => deletePerson(person)}/>
    </div>
  )
}

const Filter = ({newNameFilter, handleNameFilter}) => {
  return (
    <div>
      filter shown with: <input value={newNameFilter} onChange={handleNameFilter} />
    </div>
  )
}

const AddPerson = (props) => {
  return (
    <>
    <h2>add a new</h2>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
    </>
  )
}

const Persons = (props) => {
  return (
    <>
    <h2>Numbers</h2>
    <ul>
      {props.persons
        .filter(person => person.name.toLowerCase().startsWith(props.newNameFilter.toLowerCase()))
        .map(person => <Person person={person} deletePerson={props.deletePerson} key={person.id}/>)}
    </ul> 
    </>
  )
}

const Person = ({person, deletePerson}) => {
  return (
    <li key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></li>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="confirmation">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default App