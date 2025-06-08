import { FormInput, SubmitBtn } from "../Components";
import { Form, Link, redirect, useActionData, useNavigation } from 'react-router';
import userSchema from "../utils/registerValidation";
import * as Yup from 'yup';
import { register } from "../utils/api";
import { toast } from "react-toastify";
import { useCallback, useState } from "react";


// Function, responsible for sending a request to db for registering a user
export const action = async({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    // Validate with Yup, before passing down to backend
    await userSchema.validate(data, { abortEarly: false });
    const response = await register(data);

    toast.success('Account Created successfully!');
    console.log(response);

    return redirect('/login');
  } 
  catch(error) {
    if (error instanceof Yup.ValidationError) {
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });

      return { errors };
    }

    toast.error(error.msg.error);
    return null;
  }
};


const Register = () => {

  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === 'submitting';

  // Local validation state
  const [fieldErrors, setFieldErrors] = useState({});
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [touchedFields, setTouchedFields] = useState({});

  // Validate single field - useCallback to cache this
  const validateSingleField = useCallback(async (fieldName, value) => {
    try {
      await userSchema.validateAt(fieldName, {
        ...formValues,
        [fieldName]: value
      });
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return { isValid: false, error: error.message };
      }
      throw error;
    }
  }, [formValues]);

  // When user Clicks away
  const handleFieldBlur = useCallback(async (fieldName, value) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));

    const validation = await validateSingleField(fieldName, value);
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: validation.error
    }));
  }, [validateSingleField]);

  const handleFieldChange = useCallback(async (fieldName, value) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));

    // Clear errors when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: null }));
    };

    // Snowflake treatment for password confirmation
    if (fieldName === 'confirmPassword' || fieldName === 'password') {
      const updatedValues = { ...formValues, [fieldName]: value };

      if (updatedValues.password && updatedValues.confirmPassword) {
        const validation = await validateSingleField('confirmPassword', updatedValues.confirmPassword);
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: validation.error
        }));
      }
    } 
  }, [formValues, fieldErrors, validateSingleField]);

  // Check if form is valid for submit button
  const isFormValid = useCallback(() => {
    const hasErrors = Object.values(fieldErrors).some(error => error !== null && error !== undefined);
    const hasAllValues = Object.values(formValues).every(value => value && value.trim() !== '');
    const passwordsMatch = formValues.password && formValues.confirmPassword && 
                          formValues.password === formValues.confirmPassword;
    
    return !hasErrors && hasAllValues && passwordsMatch;
  }, [fieldErrors, formValues]);
  
  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || (actionData?.errors?.[fieldName]);
  };


  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
    <h4 className="text-center text-3xl font-bold mb-6">Eonpad<br /> Take notes simpler</h4>
            <Form method="POST" className="rounded-2xl shadow-lg w-full max-w-sm p-8">
            <div className="space-y-4">
              <FormInput 
                type="text" 
                label="First Name" 
                value={formValues.firstName} 
                error={getFieldError('firstName')} 
                showError={touchedFields.firstName}
                onChange={(value) => handleFieldChange('firstName', value)}
                onBlur={(value) => handleFieldBlur('firstName', value)}
                name="firstName" 
              />
         <FormInput 
            type="text" 
            label="Last Name" 
            name="lastName"
            value={formValues.lastName}
            error={getFieldError('lastName')}
            showError={touchedFields.lastName}
            onChange={(value) => handleFieldChange('lastName', value)}
            onBlur={(value) => handleFieldBlur('lastName', value)}
          />
          
          <FormInput 
            type="text" 
            label="Username" 
            name="username"
            value={formValues.username}
            error={getFieldError('username')}
            showError={touchedFields.username}
            onChange={(value) => handleFieldChange('username', value)}
            onBlur={(value) => handleFieldBlur('username', value)}
          />
          
          <FormInput 
            type="password" 
            label="Password" 
            name="password"
            value={formValues.password}
            error={getFieldError('password')}
            showError={touchedFields.password}
            onChange={(value) => handleFieldChange('password', value)}
            onBlur={(value) => handleFieldBlur('password', value)}
          />
          
          <FormInput 
            type="password" 
            label="Confirm Password" 
            name="confirmPassword"
            value={formValues.confirmPassword}
            error={getFieldError('confirmPassword')}
            showError={touchedFields.confirmPassword || formValues.confirmPassword.length > 0}
            onChange={(value) => handleFieldChange('confirmPassword', value)}
            onBlur={(value) => handleFieldBlur('confirmPassword', value)}
          />

          {actionData?.errors?.general && (
            <div className="text-red-500 text-sm text-center">
              {actionData.errors.general}
            </div>
          )}
          <div className="mt-6">
            <SubmitBtn 
              text="Register" 
              disabled={!isFormValid()}
            />
          </div>

            <p className="text-center">
                Already have an account?
                <Link to='/login' className="ml-2 link link-hover link-primary capitalize">
                  Sign in.
              </Link>
            </p>
            </div>
            </Form>
    </section>
  )
}

export default Register;
