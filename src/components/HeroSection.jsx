import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Journey to Fitness, Mastered.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Connect with elite coaches and discover premier gyms tailored to your goals. Achieve your peak performance with personalized guidance.
            </p>
            <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors shadow-lg hover:shadow-xl">
              Find Your Coach
            </button>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fitness training"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
