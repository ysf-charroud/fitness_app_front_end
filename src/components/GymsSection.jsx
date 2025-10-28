import React from 'react';

const GymsSection = () => {
  const gyms = [
    {
      name: 'Elite Performance Hub',
      location: 'Downtown',
      amenities: ['Cardio Zone', 'Strength Area', 'Personal Training'],
      price: '$99/month',
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Zen Yoga Retreat',
      location: 'Westside',
      amenities: ['Yoga Studio', 'Meditation Room', 'Wellness Center'],
      price: '$79/month',
      image: 'https://images.pexels.com/photos/3822167/pexels-photo-3822167.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Dynamic Athletics Center',
      location: 'Northside',
      amenities: ['CrossFit Box', 'Olympic Lifting', 'Group Classes'],
      price: '$119/month',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Community Wellness Center',
      location: 'Eastside',
      amenities: ['Pool', 'Sauna', 'Basketball Court'],
      price: '$89/month',
      image: 'https://images.pexels.com/photos/4058224/pexels-photo-4058224.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <section id="gyms" className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Explore Our Partner Gyms & Facilities
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {gyms.map((gym, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {gym.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {gym.name}
                </h3>
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {gym.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  {gym.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-50 text-primary rounded-full text-xs font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GymsSection;
