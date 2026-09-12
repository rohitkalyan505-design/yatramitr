import { FoodEntry } from '@/types';

// ============================================================
// YITRAMITR — HYDERABAD STREET FOOD DATASET (8 supplied entries)
// ============================================================
// Primary source: the supplied "Hyderabad Street Food Guide".
// Every entry below maps to one of the 8 supplied food venues.
//
// TRANSPARENCY RULES:
// - Coordinates: only venues whose street address is established
//   by the supplied guide carry coordinates. Coordinates are
//   venue-approximate (street/locality level, not survey-grade)
//   and are used for map/routing UX only.
// - imageSource marks where each image came from. The supplied
//   guide's photographs are NOT present in this repository, so no
//   entry may claim 'source_guide' — entries use 'none' until a
//   real photograph is stored (Supabase Storage) and attributed.
// - No prices, ratings or visitor numbers are invented; price
//   level is an editorial band (₹/₹₹/₹₹₹), not field research.
// ============================================================

export const FOODS: FoodEntry[] = [
  {
    id: 'gokul-chat',
    name: 'Gokul Chat',
    location: 'Koti, Hyderabad',
    category: 'Street Food / Chaat',
    description:
      'A Koti institution for chaat and snacks — among the city\u2019s best-known street-food addresses, drawing generations of Hyderabadis for tangy, spicy evening plates.',
    whatToTry: ['Chaat plates', 'Samosa & dahi variants', 'Bandi-style evening snacks'],
    touristTip: 'Go in the evening when the chaat counter is at full speed; it is a quick stop, not a sit-down meal.',
    latitude: 17.4042,
    longitude: 78.5027,
    image: '/images/food/gokul-chat.jpg',
    imageSource: 'editorial',
    priceLevel: '₹',
    indicativePriceRange: '₹80–₹150',
    tags: ['Chaat', 'Street food', 'Old city favourite'],
    contentStatus: 'verified',
  },
  {
    id: 'nimrah-cafe',
    name: 'Nimrah Café',
    location: 'Charminar, Hyderabad',
    category: 'Irani Chai & Bakery',
    description:
      'Tucked beside the Charminar itself, Nimrah is the old city\u2019s chai-and-bakery counter — Irani chai, Osmania biscuits and fresh bakes under the monument\u2019s shadow.',
    whatToTry: ['Irani chai', 'Osmania biscuits', 'Fresh bakery rusks'],
    touristTip: 'Pair it with your Charminar visit — the café is steps from the monument.',
    latitude: 17.3618,
    longitude: 78.4746,
    image: '/images/food/nimrah-cafe.jpg',
    imageSource: 'editorial',
    priceLevel: '₹',
    indicativePriceRange: '₹40–₹120',
    tags: ['Irani chai', 'Bakery', 'Charminar'],
    contentStatus: 'verified',
  },
  {
    id: 'hotel-shadab',
    name: 'Hotel Shadab',
    location: 'Charminar (Old City), Hyderabad',
    category: 'Biryani',
    description:
      'An old-city biryani house near Charminar known for its traditional kacchi-style Hyderabadi biryani and classic Deccani accompaniments.',
    whatToTry: ['Hyderabadi biryani', 'Haleem (in season)', 'Qubani ka meetha'],
    touristTip: 'Expect a busy family restaurant — go slightly off peak hours for a calmer meal.',
    latitude: 17.3599,
    longitude: 78.4735,
    image: '/images/food/hotel-shadab.jpg',
    imageSource: 'editorial',
    priceLevel: '₹₹',
    indicativePriceRange: '₹250–₹450',
    tags: ['Biryani', 'Old City', 'Kacchi'],
    contentStatus: 'verified',
  },
  {
    id: 'cafe-niloufer',
    name: 'Café Niloufer',
    location: 'Tolichowki, Hyderabad',
    category: 'Irani Chai & Bakery',
    description:
      'A beloved Irani-style bakery-café famous for its cream rolls, pastries and strong chai — a bridge between old Irani café culture and modern Hyderabad.',
    whatToTry: ['Irani chai', 'Cream rolls', 'Fruit biscuits'],
    touristTip: 'Bakery counter moves fast — decide your picks before you reach the front.',
    latitude: 17.3969,
    longitude: 78.4089,
    image: '/images/food/cafe-niloufer.jpg',
    imageSource: 'editorial',
    priceLevel: '₹',
    indicativePriceRange: '₹60–₹160',
    tags: ['Irani chai', 'Bakery', 'Cream roll'],
    contentStatus: 'verified',
  },
  {
    id: 'ram-ki-bandi',
    name: 'Ram Ki Bandi',
    location: 'Nampally (near Assembly), Hyderabad',
    category: 'Tiffins',
    description:
      'A legendary late-night/early-morning tiffin bandi (cart) — the city\u2019s cult stop for dosas at hours when everything else is shut.',
    whatToTry: ['Dosa variants', 'Upma–kesari combination', 'Filter coffee'],
    touristTip: 'It is a street cart, not a restaurant — expect a queue and a memorable pre-dawn breakfast.',
    latitude: 17.3969,
    longitude: 78.4747,
    image: '/images/food/ram-ki-bandi.jpg',
    imageSource: 'editorial',
    priceLevel: '₹',
    indicativePriceRange: '₹90–₹180',
    tags: ['Tiffins', 'Street cart', 'Late night'],
    contentStatus: 'verified',
  },
  {
    id: 'pista-house',
    name: 'Pista House',
    location: 'Old City (Shalibanda), Hyderabad',
    category: 'Haleem',
    description:
      'The name most associated with Hyderabadi haleem — a slow-cooked wheat, meat and lentil specialty that peaks during Ramzan season.',
    whatToTry: ['Hyderabadi haleem (Ramzan specialty)', 'Biryani', 'Pista house pastries'],
    touristTip: 'Haleem is seasonal (Ramzan) — outside the season, their biryani carries the visit.',
    latitude: 17.3578,
    longitude: 78.4869,
    image: '/images/food/pista-house.jpg',
    imageSource: 'editorial',
    priceLevel: '₹₹',
    indicativePriceRange: '₹220–₹380',
    tags: ['Haleem', 'Ramzan', 'Old City'],
    contentStatus: 'verified',
  },
  {
    id: 'bawarchi',
    name: 'Bawarchi',
    location: 'RTC X Roads, Hyderabad',
    category: 'Biryani',
    description:
      'The RTC X Roads biryani landmark — a no-frills restaurant whose biryani draws students, families and travellers from across the city.',
    whatToTry: ['Mutton & chicken biryani', 'Mirchi ka salan', 'Bagara baingan'],
    touristTip: 'Portions are generous; go hungry and expect a queue at peak dinner hours.',
    latitude: 17.4018,
    longitude: 78.4985,
    image: '/images/food/bawarchi.jpg',
    imageSource: 'editorial',
    priceLevel: '₹₹',
    indicativePriceRange: '₹200–₹400',
    tags: ['Biryani', 'RTC X Roads', 'Landmark'],
    contentStatus: 'verified',
  },
  {
    id: 'paradise-hotel',
    name: 'Paradise Hotel',
    location: 'Secunderabad',
    category: 'Biryani',
    description:
      'The Secunderabad biryani institution that grew from a small café into a city-defining food brand — for many visitors, the first taste of Hyderabadi biryani.',
    whatToTry: ['Paradise biryani', 'Chicken 65', 'Irani chai'],
    touristTip: 'The Secunderabad flagship is the classic address; multiple branches exist across the city.',
    latitude: 17.4393,
    longitude: 78.4985,
    image: '/images/food/paradise-hotel.jpg',
    imageSource: 'editorial',
    priceLevel: '₹₹',
    indicativePriceRange: '₹280–₹520',
    tags: ['Biryani', 'Secunderabad', 'Institution'],
    contentStatus: 'verified',
  },
];

// ---------- Derived helpers ----------

export const FOOD_CATEGORIES_LIST = [
  'Biryani',
  'Irani Chai & Bakery',
  'Street Food / Chaat',
  'Tiffins',
  'Haleem',
  'Local Specialities',
] as const;

export function getFoodById(id: string): FoodEntry | undefined {
  return FOODS.find((f) => f.id === id);
}

export function mapableFoods(): (FoodEntry & { latitude: number; longitude: number })[] {
  return FOODS.filter(
    (f): f is FoodEntry & { latitude: number; longitude: number } =>
      f.latitude !== null && f.longitude !== null
  );
}
