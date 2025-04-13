import { useState } from "react";
import { InputFields } from "../../Components";
import './LoginPage.css'

// should be placed somewhere else, clutters like hell
const loginUrl = "http://localhost:3000/login"

// Login-specific input fields
const inputValues = [
  { id: 1, username: "username", type: "text", label: "Username" },
  { id: 2, password: "password", type: "password", label: "Password" }
];

const LoginPage = () => {

  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  const handleChange = async (event) => {
    setValues({...values, [event.target.name] : event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <main>
      <h2 className="login-title">Login</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {inputValues.map((input) => (
          <InputFields key={input.id} onChange={handleChange} {...input} value={values[input.name]} />
          ))}
          <button type="submit" className="submit-btn">Go to notes</button>
        </form>
      </div>
    </main>
  )

}

export default LoginPage
