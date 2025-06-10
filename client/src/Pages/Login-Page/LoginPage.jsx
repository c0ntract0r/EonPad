import { useState } from "react";
import { InputFields } from "../../Components";
import './LoginPage.css'
import { useMutation } from "@tanstack/react-query"
import { login } from "../../utils/api";
import { useNavigate } from "react-router";


// Login-specific input fields
const inputValues = [
  { id: 1, name: "username", type: "text", label: "Username" },
  { id: 2, name: "password", type: "password", label: "Password" }
];

const LoginPage = () => {

  const [values, setValues] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  // needs to be call to backend
  const { mutate: signIn, isPending, isError } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/', {
        // Don't go back to login page
        replace: true
      })
    }
  });

  const handleChange = async (event) => {
    setValues({...values, [event.target.name] : event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <main>
      <h2 className="login-title">Login</h2>
      <div className="form-container">
        {
          isError && (<h1>Invalid username or password!</h1>)
        }
        <form onSubmit={handleSubmit}>
          {inputValues.map((input) => (
          <InputFields key={input.id} onChange={handleChange} {...input} value={values[input.name]} />
          ))}
          <button onKeyDown={(e) => e.key === "Enter" && signIn({ username: values.username, password: values.password })} onClick={ () => signIn({ username: values.username, password: values.password }) } disabled={ !values.username ||  values.password.length < 8 } type="submit" className="submit-btn">Go to notes</button>
        </form>
        <a className="anchor" href="/register">Don't have an account? Sign up.</a>
      </div>
    </main>
  )

}

export default LoginPage;
