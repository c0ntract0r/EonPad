import { useState } from "react";
// import { InputFields } from "../../Components";
import userSchema from "../../utils/registerValidation";
import * as Yup from 'yup';
import axios from 'axios';

const registerUrl = "http://localhost:3000/register"

const RegisterPage = () => {

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // check if user has clicked the submit button - used only when successful
  const [submitted, setSubmitted] = useState(false);

  const [errorState, setErrorState] = useState(false);

  const registerHandler = async () => {
    try {
      const resp = await axios.post(registerUrl, { firstName: values.firstName, lastName: values.lastName, username: values.username, password: values.password, confirmPassword: values.confirmPassword });
      console.log(resp.data);
    } catch (err) {
      console.log('We have an error!');
      console.log(err);
    }
  }


  const handleChange = (event) => {
    setValues({ ...values, [event.target.name] : event.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await userSchema.validate({firstName: values.firstName, 
                                 lastName: values.lastName,
                                 username: values.username,
                                 password: values.password,
                                 confirmPassword: values.confirmPassword}, {abortEarly: false});
      // Example of validating each one individually 
      // await userSchema.validateAt('firstName', {firstName: values.firstName });
      setErrorState(false);
      setSubmitted(true);
      await registerHandler();
    }
    catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors = {
          firstName: '',
          lastName: '',
          username: '',
          password: '',
          confirmPassword: ''
        };
        error.inner.forEach((err) => {
          if (err.path && newErrors.hasOwnProperty(err.path)) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Unexpected error:', error);
      }


      setErrorState(true);
      // console.log('Validation errors:', error.errors);
      // console.log(error.message);
    }
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label>First name</label>
        <input type="text" name="firstName" placeholder="John" value={values.firstName} onChange={handleChange} />
        {errorState && <span style={{ color: 'red' }}>{errors.firstName}</span>}
      </div>
      <div>
        <label>Last name</label>
        <input type="text" name="lastName" placeholder="Doe" value={values.lastName} onChange={handleChange} />
        {errorState && <span style={{ color: 'red' }}>{errors.lastName}</span>}
      </div>
      <div>
        <label>Username</label>
        <input type="text" name="username" placeholder="username" value={values.username} onChange={handleChange} />
        {errorState && <span style={{ color: 'red' }}>{errors.username}</span>}
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={values.password} onChange={handleChange} />
        {errorState && <span style={{ color: 'red' }}>{errors.password}</span>}
      </div>
      <div>
        <label>Confirm password</label>
        <input type="password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} />
        {errorState && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
      </div>
      <button type="submit">
        Register
      </button>
    </form>
    {submitted && <div><h2>Form submitted</h2></div>}
    </div>
  )
}

export default RegisterPage;