import { useState } from 'react'

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [avg, setAvg] = useState(0)
  const [positive, setPositive] = useState(0 + '%')

  const ClickType = {
    GOOD: 1,
    NEUTRAL: 2,
    BAD: 3
  }

  const click = (clickType) => {
    let updGood = good;
    let updNeutral = neutral;
    let updBad = bad;

    switch (clickType) {
      case ClickType.GOOD:
        updGood = good + 1;
        setGood(updGood);
        break;
      case ClickType.NEUTRAL:
        updNeutral = neutral + 1;
        setNeutral(updNeutral);
        break;
      case ClickType.BAD:
        updBad = bad + 1;
        setBad(updBad);
        break;
      default:
        console.log("Wrong clickType passed as argument");
        break;
    }

    let updAll = all + 1;
    setAll(updAll);
    setAvg((updGood - updBad) / updAll);
    setPositive(((updGood / updAll)*100) + "%");
  }

  return (
    <>
    <h1>Give feedback!</h1>
    <Button onClick={() => click(ClickType.GOOD)} text = "good"/> 
    <Button onClick={() => click(ClickType.NEUTRAL)} text = "neutral"/> 
    <Button onClick={() => click(ClickType.BAD)} text = "bad"/> 
    <Statistics good={good} bad={bad} neutral={neutral} avg={avg} all={all} positive={positive}/>
    </>
  )
}

const Button = (props) => {
  return (
    <>
    <button onClick={props.onClick}>{props.text}</button> 
    </>
  )
}

const Statistics = (props) => {
  if (props.all == 0) {
    return (
      <div>
        <h2>Statistics:</h2>
        No feedback given
      </div>
    )
  } else {
    return (
      <div>
        <h2>Statistics:</h2>
        <table>
          <tbody>
            <StatisticLine text={"good"} value={props.good}/>
            <StatisticLine text={"neutral"} value={props.neutral}/>
            <StatisticLine text={"bad"} value={props.bad}/>
            <StatisticLine text={"all"} value={props.all}/>
            <StatisticLine text={"average"} value={props.avg}/>
            <StatisticLine text={"positive"} value={props.positive}/>
          </tbody>
        </table>
      </div>
    )
  }
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

export default App
