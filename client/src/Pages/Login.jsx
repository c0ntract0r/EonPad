import { FormInput, SubmitBtn } from "../Components";
import { Form, Link, redirect, useNavigate } from 'react-router';
import { login } from "../utils/api";
import { toast } from "react-toastify";
import { loginUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

// Create the login action
export const action = (store) => async ({request}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await login(data);
    store.dispatch(loginUser(response.data));
    toast.success('Logged in successfully!');
    return redirect('/');
  } 
  catch(error) {
    toast.error(error.msg);
    return null;
  }
};


const Login = () => {
  return (
      <section className="min-h-screen flex flex-col justify-center items-center">
        <h4 className="text-center text-3xl font-bold mb-6">Login</h4>
        <Form method="post" className="rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="space-y-4">

        <FormInput type="text" label="Username" name="username" />
        <FormInput type="password" label="Password" name="password" />

        <div className="mt-6">
        <SubmitBtn text="login" />
        </div>
        <p className="text-center">
            Don't have an account?
            <Link to='/register' className="ml-2 link link-hover link-primary capitalize">
              Sign up.
          </Link>
        </p>
        </div>
        </Form>
      </section>
  );
};

export default Login;
