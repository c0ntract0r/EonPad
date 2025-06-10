import { FaSitemap, FaFeather, FaCloud, FaCodeBranch } from "react-icons/fa";

const Features = () => {
    return (
        <section id="features" className="py-20 px-6 bg-base-100">
            <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
                <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                    <div className="card-body items-center text-center p-6">
                        <div className="text-5xl text-primary mb-6">
                            <i><FaSitemap /></i>
                        </div>
                        <h3 className="card-title text-2xl mb-4">Unlimited Hierarchy</h3>
                        <p className="text-md">Create as many levels of hierarchy as you need to organize your thoughts exactly how you want.</p>
                    </div>
                </div>
    
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
      <div className="card-body items-center text-center p-6">
        <div className="text-5xl text-primary mb-6">
          <i><FaFeather /></i>
        </div>
        <h3 className="card-title text-2xl mb-4">Intuitive Design</h3>
        <p className="text-md">Clean, distraction-free interface that lets you focus on your thoughts. Start using it in seconds with no learning curve.</p>
      </div>
    </div>
    
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
      <div className="card-body items-center text-center p-6">
        <div className="text-5xl text-primary mb-6">
          <i><FaCloud /></i>
        </div>
        <h3 className="card-title text-2xl mb-4">Cloud Sync</h3>
        <p className="text-md">Access your notes from anywhere with seamless cloud synchronization across all your devices. Currently free while in beta.</p>
      </div>
    </div>
    
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
      <div className="card-body items-center text-center p-6">
        <div className="text-5xl text-primary mb-6">
          <i><FaCodeBranch /></i>
        </div>
        <h3 className="card-title text-2xl mb-4">Open Source</h3>
        <p className="text-md">Completely open source and community-driven. Contribute to the development or host your own instance.</p>
      </div>
    </div>
  </div>
</section>
    )
  }
  
  export default Features;
  