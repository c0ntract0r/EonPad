const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="text-black py-6 text-center">
            <div className="container mx-auto px-4">
            <p className="text-base-2">eonpadnotes.com {currentYear}</p>
            <p className="text-sm text-gray-400">made by c0ntract0r</p>
            </div>
        </footer>
    );
};


export default Footer;