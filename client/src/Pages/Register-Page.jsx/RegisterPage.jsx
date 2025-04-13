import { useState } from "react";
import { InputFields, Footer } from "../../Components";
import userSchema from "../../utils/registerValidation";
import * as Yup from 'yup';
import axios from 'axios';
import './RegisterPage.css'

// should be placed somewhere else, clutters like hell
const registerUrl = "http://localhost:3000/register"

// Register-field specific input fields
const inputValues = [
  { id: 1,name: "firstName",type: "text", label: "First Name" },
  { id: 2, name: "lastName", type: "text", label: "Last Name" },
  { id: 3, name: "username", type: "text",label: "Username"},
  { id: 4, name: "password", type: "password", label: "Password" },
  { id: 5, name: "confirmPassword", type: "password", label: "Confirm Password" }
  ];

// values themselves - save some lines
const initValues = {
  firstName: "", lastName: "", username: "", password: "", confirmPassword: ""
};


// FUNCTION START
const RegisterPage = () => {

  const [values, setValues] = useState(initValues)
  const [errors, setErrors] = useState(initValues);
  // enable only when every field value is correct
  const [disableButton, setDisableButton] = useState(true);
  // keep track if any errors have been encountered
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

  const validateSingleField = async (fieldName, value) => {
    try {
      await userSchema.validateAt(fieldName, { [fieldName] : value});
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return { isValid: false, error: error.message };
      }
      throw error;
    }
  }

  // keep track of values - OK
  const handleChange = async (event) => {
    setValues({ ...values, [event.target.name] : event.target.value });
  }

  // if user switches to another field
  const handleBlur = async (event) => {
    const result = await validateSingleField(event.target.name, event.target.value);
    if (result.isValid === false) {
      setErrorState(true);
      setErrors({ ...errors, [event.target.name] : result.error });
    } else {
      setErrorState(false);
      setErrors({ ...errors, [event.target.name] : "" });
    }
  } 

  // called when user hits the register button
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await userSchema.validate({firstName: values.firstName, 
                                 lastName: values.lastName,
                                 username: values.username,
                                 password: values.password,
                                 confirmPassword: values.confirmPassword}, {abortEarly: false});
      setErrorState(false);
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
    }
  }

  return (
    <>
    <main>
      <h2 className="register-title">Eonpad<br />Take notes simpler</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
        {inputValues.map((input) => (
          <InputFields key={input.id} handleBlur={handleBlur} errState={errorState} error={errors[input.name]} onChange={handleChange} {...input} value={values[input.name]} />
        ))}
        <button type="submit" className="submit-btn">Register</button>
        </form>
        <a className="anchor" href="/login">Already have an account? Sign in.</a>
      </div>
    </main>
    <Footer />
    </>
  )
}

export default RegisterPage;