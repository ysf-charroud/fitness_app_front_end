import React from 'react';

const CTA = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-purple-700 py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Fitness?
        </h2>
        <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who are achieving their goals with Fitness Journey. Sign up today!
        </p>
        <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl">
          Start Your Journey Now
        </button>
      </div>
    </section>
  );
};

export default CTA;
