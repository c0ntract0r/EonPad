import { NavLink } from "react-router";
import { FaGithub } from 'react-icons/fa';

// The following ones is what should be in the center of the navigation bar
const links = [
    { id: 1, url: '/', text: 'Home' },
    { id: 2, url: 'about', text: 'About' },
    { id: 4, url: 'features', text: 'Features' },
    { id: 3, url: 'https://github.com/c0ntract0r/EonPad', text: 'GitHub' }
];

const NavLinks = () => {
    return (
        <>
            {links.map((link) => {
                const { id, url, text } = link;
                return (
                    <li key={id}>
                        <NavLink className="capitalize lg:text-lg lg:font-semibold" to={url}>
                            {id === 3 && <FaGithub className="inline-block" />}
                            {text}
                        </NavLink>
                    </li>
                );
            })}
        </>
    );
};

export default NavLinks;