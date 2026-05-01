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

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  tourId: number;
  travelers: number;
  date: string;
  specialRequests?: string;
}