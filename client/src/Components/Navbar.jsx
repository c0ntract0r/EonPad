import { NavLink, Link } from 'react-router';
import NavLinks  from './NavLinks';
import { IoMdMenu, IoIosSunny, IoIosMoon } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/user/userSlice';


// MAIN NAVBAR FUNCTION
const Navbar = () => {
    // Get user state to see if someone exists logged in. If yes, move to dashboard
    const user = useSelector((state) => state.userState.user);
    const dispatch = useDispatch();

    // Everytime, when icon is clicked for theme change, exec this func
    const handleTheme = () => {
        dispatch(toggleTheme());
    };

    // Render navbar UI
    return (
        <nav>
            <div className='navbar align-element'>
                <div className="navbar-start">
                { /* TITLE */ }
                <NavLink to='/' className='mx-32 hidden lg:flex btn btn-ghost text-3xl items-center'>
                    Eonpad
                </NavLink>
                { /* In case screen is small enough for menu to appear */ }
                <div className="dropdown">
                    <label tabIndex={0} className='btn btn-ghost lg:hidden'><IoMdMenu className='h-6 w-6' />
                    </label>
                    <ul tabIndex={0} className='menu menu-small dropdown-content mt-3 z-[1] p-2 shadow bg-[#e5e0de] rounder-box w-52'><NavLinks /></ul>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                <ul className='menu menu-horizontal'><NavLinks /></ul>
                 </div>
                <div className="navbar-end">
                {/* THEME SETUP */}
                <label className='swap swap-rotate'>
                    <input type="checkbox" onChange={handleTheme} />
                    {/* sun icon */}
                    <IoIosSunny className='swap-on text-4xl h-4 w-4' />
                    {/* moon icon */}
                    <IoIosMoon className='swap-off h-4 w-4' />
                </label>
                {/* Show login and register buttons, if no user signed in, otherwise, navigate the user to dashboard */}
                {user ? (<Link to='/dashboard' className='btn btn-accent btn-md ml-4 text-white m-8'>Go to my Dashboard</Link>) : (
                    <>
                        <Link to='/login' className='btn btn-ghost btn-md ml-4'>Login</Link>
                        <Link to='/register' className='btn btn-accent btn-md ml-4 text-white m-8'>Register</Link>
                    </>
                ) }
                
            </div>
            </div>
        </nav>
    )
    
}


export default Navbar;