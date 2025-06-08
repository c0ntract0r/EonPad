import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-base-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <div className="font-semibold">made by c0ntract0r</div>
                <div className="text-sm text-gray-500">Open source hierarchical note-taking application</div>
            </div>
            <div className="flex gap-4">
                <a href="https://github.com/c0ntract0r" className="text-gray-500 hover:text-primary text-xl transition-colors" target="_blank" rel="noopener noreferrer">
                    <i><FaGithub /></i>
                </a>
                <a href="https://x.com/c0ntract0r" className="text-gray-500 hover:text-primary text-xl transition-colors" target="_blank" rel="noopener noreferrer">
                    <i><FaSquareXTwitter /></i>
                </a>
                <a href="https://linkedin.com/in/c0ntract0r" className="text-gray-500 hover:text-primary text-xl transition-colors" target="_blank" rel="noopener noreferrer">
                    <i><FaLinkedin /></i>
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer;
