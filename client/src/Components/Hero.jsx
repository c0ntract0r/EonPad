import sampleImg from '../assets/sampleImg.jpeg'

const Hero = () => {
  return (
    <div className="flex-grow">
        <section className="mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="lg:px-30">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">Organize your thoughts, Hierarchically</h1>
                <p className="text-lg text-gray-600 mb-4">Eonpad is an open source note-taking application designed for those who think in structures. Organize your ideas with infinite levels of hierarchy and connect your thoughts effortlessly.</p>
                <div className="alert bg-primary/10 text-primary mb-8">
                    <div>
                        <span>Currently free to use! Cloud version available at no cost while in beta. Support our development through donations.</span>
                    </div>
                </div>
            </div>
            <div className="max-w-md w-full m-8">
                <img src={sampleImg} alt="Eonpad App Screenshot" className="w-full h-auto rounded-lg shadow-2xl"></img>
            </div>
        </section>
    </div>
  )
}

export default Hero;
