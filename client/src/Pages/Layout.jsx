/* ROOT PAGE LAYOUT */

import { Outlet } from 'react-router';
import { Navbar } from '../Components/';

const Layout = () => {
    return (
        <>
            <Navbar />
            <section className='align-element py-20'>
                <Outlet />
            </section>
        </>
    )
}

export default Layout;
