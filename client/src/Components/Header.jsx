import { Link } from "react-router";


const Header = () => {
    return (
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
            <a href="#" className="text-primary text-2xl font-bold">Eonpad</a>
            <nav className="hidden md:flex items-center gap-8">
                <Link to='#features' className="text-gray-700 hover:text-primary transition-colors">Features</Link>
                <Link to='/about' className="text-gray-700 hover:text-primary transition-colors">About</Link>
                <Link to='https://github.com/c0ntract0r/EonPad' className="text-gray-700 hover:text-primary transition-colors" 
                     target="_blank" rel="noopener noreferrer"> <FontAwesomeIcon icon={faGithub} /> Github</Link>
                <Link to='/login' className="btn ml-4 btn-accent text-white">Login</Link>
                <Link to='/register' className="btn ml-4 btn-primary text-white">Register</Link>
            </nav>
            <div className="md:hidden">
            <button className="btn btn-ghost">
                <i className="fas fa-bars"></i>
            </button>
        </div>
        </header>
    )
}

export default Header;