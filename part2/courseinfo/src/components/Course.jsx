
const Course = ({course}) => {
    return (
        <div>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total
            total={
              course.parts
                .map(part => part.exercises)
                .reduce((partialSum, exercises) => partialSum + exercises, 0)
            }
          />
        </div>
      )
}

const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => (
  <div>
    <ul>
      {props.parts.map(part => <Part key={part.id} part={part} />)}
    </ul>
  </div>
)

const Part = (props) => {
  return (
    <li>
      {props.part.name} {props.part.exercises}
    </li>
  )
}

const Total = (props) => <p>Number of exercises {props.total}</p>

export default Course