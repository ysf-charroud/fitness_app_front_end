// src/constants/equipmentCatalog.js

export const EQUIPMENT_CATALOG = [
  {
    id: 'treadmill',
    title: 'Treadmill',
    picture: 'https://media.istockphoto.com/id/1172191646/photo/young-man-running-on-a-treadmill-at-home.jpg?s=612x612&w=0&k=20&c=cmun8-Bw_UkvWKRcjv-hHo_Fp0iVtGGRAYyb2h632Zs=', // Replace with actual image URLs
    type: 'Cardio',
    details: 'Standard running/walking machine.'
  },
  {
    id: 'elliptical',
    title: 'Elliptical',
    picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRezSEtGabYA5SMQDCg21kVQQHJfDAbUrS3MQ&s',
    type: 'Cardio',
    details: 'Low-impact cardio machine.'
  },
  {
    id: 'stationary_bike',
    title: 'Stationary Bike',
    picture: 'https://chrissports.com/cdn/shop/files/2_TRAX_recumbent_bike_stationary_Chris_Sports_6_800x.jpg?v=1708419502',
    type: 'Cardio',
    details: 'Upright or recumbent cycling machine.'
  },
  {
    id: 'dumbbells',
    title: 'Dumbbells',
    picture: 'https://m.media-amazon.com/images/I/91QxtmB7tEL._AC_SL1500_.jpg',
    type: 'Free Weights',
    details: 'Various weights available.'
  },
  {
    id: 'barbells',
    title: 'Barbells',
    picture: 'https://titan.fitness/cdn/shop/files/420052_01.jpg?v=1706747078&width=1946',
    type: 'Free Weights',
    details: 'Standard Olympic barbells.'
  },
  {
    id: 'squat_rack',
    title: 'Squat Rack',
    picture: 'https://www.fringesport.com/cdn/shop/files/Garage-Series-Squat-Rack-Pull-Up-Bar-Fringe-Sport-106908938.jpg?v=1718672035',
    type: 'Strength',
    details: 'Power rack for squats and other lifts.'
  },
  {
    id: 'bench_press',
    title: 'Bench Press',
    picture: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:125,cw:750,ch:563,q:80,w:750/pLaRi5jXSHDKu6WRydetBo.jpg',
    type: 'Strength',
    details: 'Flat bench for pressing exercises.'
  },
  // Add more as needed...
];

// Optional: Helper function to get equipment details by ID
export const getEquipmentDetailsById = (id) => {
  return EQUIPMENT_CATALOG.find(item => item.id === id);
};