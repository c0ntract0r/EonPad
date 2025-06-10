const About = () => {
    return (
    <>
       <div className="flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center">
            <div className="stats bg-accent text-amber-100 shadow">
                <div className="stat">
                    <div className="stat-title text-primary-content text-4xl font-bold tracking-widest">
                        Comfy
                    </div>
                </div>
            </div>
            <h1 className="text-4xl font-bold leading-none tracking-tight sm:text-6xl">
                - Simple note taking!
            </h1>
        </div>
        <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque aliquid sint numquam reprehenderit corporis in non qui ad ullam libero quas vero, nostrum explicabo architecto sed cupiditate provident deleniti repudiandae exercitationem ut animi. Officiis at possimus enim dignissimos minus aspernatur.
        </p>
    </>)
}

export default About;