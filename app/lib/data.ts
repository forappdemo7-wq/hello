// app/lib/data.ts

export interface Tour {
  id: number;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  highlights: string[];
  included: string[];
}

export const tours: Tour[] = [
  {
    id: 1,
    name: "Bali Paradise Explorer",
    location: "Bali, Indonesia",
    duration: "5 Days",
    price: 899,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    description: "Experience the magic of Bali with this comprehensive tour package. Visit ancient temples, pristine beaches, and lush rice terraces.",
    highlights: [
      "Visit Uluwatu Temple",
      "Sunset dinner at Jimbaran Bay",
      "Rice terrace trekking",
      "Traditional Balinese massage"
    ],
    included: [
      "4-star accommodation",
      "Daily breakfast",
      "Private transportation",
      "English-speaking guide"
    ]
  },
  {
    id: 2,
    name: "Japanese Cultural Journey",
    location: "Tokyo, Kyoto, Osaka",
    duration: "7 Days",
    price: 1499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    description: "Immerse yourself in Japanese culture, from ancient temples to modern cityscapes.",
    highlights: [
      "Tokyo city tour",
      "Kyoto temple visit",
      "Osaka street food tour",
      "Traditional tea ceremony"
    ],
    included: [
      "Bullet train passes",
      "Traditional Ryokan stay",
      "Cultural workshops",
      "Travel insurance"
    ]
  },
  {
    id: 3,
    name: "Santorini Romance",
    location: "Santorini, Greece",
    duration: "4 Days",
    price: 1299,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    description: "Perfect romantic getaway in the stunning Greek islands with white-washed buildings and crystal clear waters.",
    highlights: [
      "Sunset in Oia",
      "Volcano cruise",
      "Wine tasting tour",
      "Beach hopping"
    ],
    included: [
      "Luxury cave hotel",
      "Sunset dinner cruise",
      "Private transfers",
      "Professional photographer"
    ]
  },
  {
    id: 4,
    name: "Swiss Alps Adventure",
    location: "Switzerland",
    duration: "6 Days",
    price: 1799,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800",
    description: "Experience the breathtaking Swiss Alps with scenic train rides and mountain adventures.",
    highlights: [
      "Jungfraujoch visit",
      "Lake Geneva cruise",
      "Paragliding experience",
      "Cheese tasting tour"
    ],
    included: [
      "Swiss Travel Pass",
      "Mountain hotels",
      "Adventure activities",
      "Swiss Army knife gift"
    ]
  }
];

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    comment: "Amazing experience! The Bali tour exceeded all expectations. The guides were knowledgeable and the itinerary was perfect.",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    rating: 5,
    comment: "Japan tour was incredible! Everything was well-organized and the cultural experiences were authentic.",
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Emma Watson",
    location: "London, UK",
    rating: 4,
    comment: "Santorini was magical! The sunset views were breathtaking. Highly recommend this tour package.",
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

export interface Cruise {
  id: number;
  name: string;
  ship: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  highlights: string[];
  included: string[];
}

export const cruises: Cruise[] = [
  {
    id: 1,
    name: "Mediterranean Majesty",
    ship: "Royal Odyssey",
    destination: "Mediterranean (Barcelona, Rome, Athens)",
    duration: "7 Nights",
    price: 2499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800",
    description: "Experience the ultimate Mediterranean cruise visiting iconic ports across Italy, Greece, and Spain. Luxury, culture, and breathtaking scenery.",
    highlights: [
      "Private balcony stateroom",
      "Unlimited premium beverages",
      "Excursions to ancient ruins",
      "Gourmet dining experiences"
    ],
    included: [
      "All meals and snacks",
      "Entertainment and activities",
      "Port taxes and fees",
      "24-hour room service"
    ]
  },
  {
    id: 2,
    name: "Caribbean Paradise",
    ship: "Sunset Voyager",
    destination: "Eastern Caribbean (Nassau, St. Thomas, St. Maarten)",
    duration: "5 Nights",
    price: 1899,
    rating: 4.8,
    image: "https://images.pexels.com/photos/11820065/pexels-photo-11820065.jpeg",
    description: "Sail to the Caribbean's most beautiful islands, relax on pristine beaches, and enjoy vibrant onboard entertainment.",
    highlights: [
      "Beach cabana day",
      "Snorkeling excursions",
      "Live music & shows",
      "All-inclusive beverage package"
    ],
    included: [
      "All meals and non-alcoholic drinks",
      "Use of water slides and pools",
      "Fitness center access",
      "Kids club activities"
    ]
  },
  {
    id: 3,
    name: "Norwegian Fjords",
    ship: "Nordic Star",
    destination: "Norwegian Fjords (Bergen, Geiranger, Flåm)",
    duration: "6 Nights",
    price: 3199,
    rating: 4.9,
    image: "https://images.pexels.com/photos/260584/pexels-photo-260584.jpeg",
    description: "Cruise through the majestic Norwegian fjords, witness waterfalls, glaciers, and charming coastal villages.",
    highlights: [
      "Fjord helicopter tour",
      "Aurora Borealis viewing",
      "Guided nature walks",
      "Sauna and spa access"
    ],
    included: [
      "All excursions",
      "Thermal suite access",
      "Specialty dining",
      "Premium drinks package"
    ]
  }
];