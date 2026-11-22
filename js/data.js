// ==========================================================================
// The Grand Horizon Luxury Hotel & Resort - Master Data Store
// ==========================================================================

const HOTEL_DATA = {
  info: {
    name: "The Grand Horizon",
    tagline: "Resort & Sanctuary",
    fullTitle: "The Grand Horizon Luxury Resort & Spa",
    rating: 5,
    starsLabel: "5-Star Ultra Luxury",
    forbesRating: "Forbes Travel Guide 5-Star Winner 2026",
    address: "Strada Panoramica 108, 84010 Ravello, Amalfi Coast, Italy",
    phone: "+39 089 972 8800",
    email: "concierge@grandhorizonresort.com",
    reservationsEmail: "reservations@grandhorizonresort.com",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    coordinates: { lat: 40.6482, lng: 14.6119 }
  },

  currencies: {
    USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
    EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
    GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
    INR: { symbol: "₹", rate: 84.5, label: "INR (₹)" }
  },

  rooms: [
    {
      id: "deluxe-ocean",
      name: "Deluxe Ocean View King",
      category: "deluxe",
      categoryName: "Deluxe Rooms",
      priceUSD: 480,
      size: "55 m² / 592 sq ft",
      capacity: 2,
      bed: "1 King Bed",
      view: "Panoramic Tyrrhenian Sea View",
      badge: "Most Popular",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Perched gracefully above the azure waters, the Deluxe Ocean View King offers a sanctuary of calm. Handcrafted Italian linens, floor-to-ceiling glass doors opening onto a private travertine balcony, and a designer marble bath.",
      amenities: [
        "Private Furnished Balcony",
        "Italian Carrara Marble Bathroom",
        "Rainforest Shower & Soaking Tub",
        "Diptyque Paris Luxury Bath Amenities",
        "Nespresso Vertuo & Artisan Tea Bar",
        "Complimentary High-Speed Wi-Fi 6",
        "Interactive 65\" 4K Smart OLED",
        "24-Hour In-Room Dining"
      ],
      featured: true
    },
    {
      id: "azure-suite",
      name: "The Azure Executive Suite",
      category: "suite",
      categoryName: "Luxury Suites",
      priceUSD: 780,
      size: "85 m² / 915 sq ft",
      capacity: 3,
      bed: "1 Super King Bed + Daybed",
      view: "Unobstructed Coastline & Cliff View",
      badge: "Signature Suite",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "An expansive suite marrying contemporary minimalism with Mediterranean charm. Features a separate parlor lounge, walk-in dressing wardrobe, and sun-drenched terrace fitted with bespoke teak loungers.",
      amenities: [
        "Spacious Separate Living Salon",
        "Wrap-Around Sun Terrace with Teak Loungers",
        "Freestanding Deep Soaking Tub with Sea View",
        "Dedicated Butler Service",
        "Complimentary Premium Stocked Mini-Bar",
        "Bespoke Down Pillow & Linen Menu",
        "Dyson Supersonic Hair Care Suite",
        "Evening Gourmet Turn-Down Gift"
      ],
      featured: true
    },
    {
      id: "horizon-penthouse",
      name: "Presidential Horizon Penthouse",
      category: "penthouse",
      categoryName: "Penthouses",
      priceUSD: 1650,
      size: "180 m² / 1,938 sq ft",
      capacity: 4,
      bed: "2 Master King Suites",
      view: "360° Panoramic Cliffside & Bay View",
      badge: "Ultra Luxury",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507038772120-7fff76f79d74?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "The crown jewel of The Grand Horizon. Occupying the entire top floor, this penthouse includes a heated private infinity plunge pool, open-concept gourmet kitchen, baby grand piano, and curated original modern art.",
      amenities: [
        "Private Rooftop Heated Infinity Plunge Pool",
        "Private Butler & Dedicated Concierge Team",
        "Chauffeured Rolls-Royce Airport Transfers",
        "Welcome Moët & Chandon Rosé and Caviar",
        "Custom Dining Salon for 8 Guests",
        "Private Sommelier Wine Cellar in Suite",
        "Full Kitchen with Optional Private Chef",
        "Unlimited Complimentary Spa Hydrotherapy"
      ],
      featured: true
    },
    {
      id: "cliffside-villa",
      name: "Cliffside Sanctuary Private Villa",
      category: "villa",
      categoryName: "Private Villas",
      priceUSD: 2200,
      size: "260 m² / 2,800 sq ft",
      capacity: 6,
      bed: "3 En-suite Master Bedrooms",
      view: "Secluded Private Bay & Mediterranean Horizon",
      badge: "Exclusive Haven",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Carved into the dramatic coastal cliffs with absolute seclusion. Boasts private tropical gardens, an Olympic-length infinity edge pool that blends into the sea, private yacht mooring, and dedicated private staff.",
      amenities: [
        "Full-Sized Infinity Edge Saltwater Pool",
        "Secluded Cliff Path to Private Beach Cove",
        "24/7 Full Villa Butler & Dedicated Executive Chef",
        "Outdoor Shaded Dining Gazebo & Fire Pit",
        "Private Boat Pier & Speedboat Transfers",
        "Private Wellness & Massage Pavilion",
        "Steinway & Sons Audio System Throughout",
        "Unrestricted VIP In-Resort Privileges"
      ],
      featured: true
    },
    {
      id: "royal-garden-suite",
      name: "Royal Botanical Garden Suite",
      category: "suite",
      categoryName: "Luxury Suites",
      priceUSD: 640,
      size: "72 m² / 775 sq ft",
      capacity: 2,
      bed: "1 King Bed",
      view: "Citrus Groves & Fragrant Botanical Gardens",
      badge: "Nature Retreat",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Nestled amidst ancient olive trees and fragrant lemon groves. An oasis of serenity featuring an outdoor sunken courtyard with a private thermal whirlpool and romantic open-sky shower.",
      amenities: [
        "Private Walled Garden & Thermal Whirlpool",
        "Open-Air Tropical Rainforest Shower",
        "Custom Botanical Aromatherapy Bar",
        "Hand-Carved Stone Soak Tub",
        "Morning Yoga & Meditation Kit Provided",
        "Complimentary Artisanal Breakfast in Bed",
        "Soundproofed Acoustic Architecture",
        "Loro Piana Cashmere Throws"
      ],
      featured: false
    },
    {
      id: "overwater-bungalow",
      name: "Horizon Overwater Lagoon Villa",
      category: "villa",
      categoryName: "Private Villas",
      priceUSD: 1450,
      size: "125 m² / 1,345 sq ft",
      capacity: 2,
      bed: "1 Four-Poster King Bed",
      view: "Crystal Turquoise Lagoon & Sunsets",
      badge: "Romance Favorite",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Directly elevated above gentle turquoise waves. Glass viewing panels set into the hardwood floors reveal vibrant marine life below. Step directly from your private sundeck into the sparkling crystal sea.",
      amenities: [
        "Direct Lagoon Ocean Stairway Access",
        "Glass Floor Marine Viewing Panels",
        "Catamaran Sun Netting Suspended Over Water",
        "Private Sundeck with Fresh Water Splash Pool",
        "Floating Breakfast Served Daily via Outrigger",
        "Sunset Champagne Turn-Down Service",
        "Submarine Drone Snorkeling Kit",
        "Master Bed with Stargazing Retractable Skylight"
      ],
      featured: false
    }
  ],

  addOns: [
    {
      id: "breakfast",
      name: "Champagne Royale Daily Breakfast",
      priceUSD: 45,
      type: "per_guest_per_day",
      description: "A lavish artisanal buffet & in-suite à la carte service with organic farm eggs, truffles, fresh pastries, and vintage champagne."
    },
    {
      id: "transfer",
      name: "Chauffeured Mercedes Maybach Airport Transfer",
      priceUSD: 180,
      type: "one_time",
      description: "Private roundtrip VIP transfer from Naples International Airport or Helipad with chilled refreshments."
    },
    {
      id: "spa_pass",
      name: "Unlimited Roman Thermal Spa & Wellness Pass",
      priceUSD: 95,
      type: "per_guest_total",
      description: "Full access to Finnish saunas, Turkish hamam, vitality hydrotherapy pools, and salt inhalation grotto."
    },
    {
      id: "candlelight_dinner",
      name: "Private Cliffside Candlelight Tasting Dinner",
      priceUSD: 290,
      type: "one_time",
      description: "A romantic 6-course degustation with paired sommelier reserves served at our private secluded cliff perch."
    }
  ],

  dining: [
    {
      id: "leclat",
      name: "L'Éclat Restaurant",
      cuisine: "Modern Mediterranean Haute Cuisine",
      stars: "3 Michelin Stars",
      hours: "Dinner: 18:30 – 23:00",
      dressCode: "Smart Elegant",
      chef: "Chef Antoine Laurent",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      description: "Perched high on the cliff with breathtaking panoramic views of the sea, L'Éclat pairs local Italian treasures—from Amalfi lemons to bluefin crudo—with cutting-edge culinary artistry.",
      signatureDishes: [
        { name: "Bluefin Tuna Tartare with Oscietra Caviar", desc: "Infused with Amalfi yuzu vinaigrette, avocado emulsion, and edible 24K gold leaves." },
        { name: "Acquerello Risotto with Red Prawns & Saffron", desc: "Slow-simmered with Sicilian red prawns, aged parmesan foam, and fragrant sea urchin butter." },
        { name: "Wood-Fired Mediterranean Sea Bass", desc: "Crusted in coastal wild thyme salt, served with confit baby fennel and smoked bouillabaisse jus." }
      ]
    },
    {
      id: "saffron-ember",
      name: "Saffron & Ember",
      cuisine: "Artisan Wood-Fired Grill & Dry Aged Meats",
      stars: "Gault & Millau 18/20",
      hours: "Lunch & Dinner: 12:30 – 23:30",
      dressCode: "Resort Chic",
      chef: "Chef Matteo Rossi",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      description: "An open-air amphitheater of wood smoke and flame. Feasts of premium A5 Miyazaki Wagyu, local caught seafood, and garden-picked heritage vegetables prepared over vintage olive charcoal.",
      signatureDishes: [
        { name: "Smoked A5 Japanese Wagyu Ribeye", desc: "Glazed in 18-year balsamic reduction with bone marrow butter and ember-roasted wild mushrooms." },
        { name: "Charred Giant Octopus", desc: "Braised in aged Nebbiolo wine, grilled over cherry wood with saffron potato emulsion." },
        { name: "Wood-Fired Burrata & Truffle Flatbread", desc: "Fior di latte, hand-foraged black summer truffles, and 24-month aged San Daniele prosciutto." }
      ]
    },
    {
      id: "mirage-lounge",
      name: "The Mirage Sunset Lounge & Bar",
      cuisine: "Craft Mixology & Sommelier Reserve",
      stars: "World's 50 Best Bars Finalist",
      hours: "16:00 – 01:30",
      dressCode: "Casual Chic",
      chef: "Master Mixologist Elena Vance",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
      description: "Golden hour elevated to an art form. Relax to soothing acoustic jazz as master bartenders create bespoke sensory cocktails, accompanied by small plates and 1,800 labels in our subterranean wine cellar.",
      signatureDishes: [
        { name: "The Grand Horizon Spritz", desc: "Hand-crafted Limoncello di Sorrento, wild elderflower liqueur, Champagne, and rosemary smoke." },
        { name: "Smoked Truffle Negroni", desc: "Campari infused with white Alba truffles, Antica Formula vermouth, and botanic gin smoked with cherry wood." },
        { name: "Artisanal Oysters & Champagne Flight", desc: "Half-dozen Belon oysters on ice paired with Krug Grande Cuvée." }
      ]
    }
  ],

  spa: [
    {
      id: "facial-gold",
      title: "Imperial 24K Gold Rejuvenation Facial",
      duration: "90 Minutes",
      priceUSD: 290,
      icon: "fa-gem",
      description: "An ultra-luxurious ritual infusing pure 24K gold leaves with peptide serums and lymphatic contour massage to restore radiant youthful luminosity.",
      suitable: "Fine lines, dullness, celebration prep"
    },
    {
      id: "massage-stone",
      title: "Himalayan Warm Salt Stone Massage",
      duration: "75 Minutes",
      priceUSD: 230,
      icon: "fa-spa",
      description: "Smooth mineral-rich Himalayan crystal salt stones warmed to therapeutic perfection, melting away tension while infusing the body with 84 trace minerals.",
      suitable: "Deep muscle fatigue, stress relief, detox"
    },
    {
      id: "marine-wrap",
      title: "Oceanic Marine Collagen Detox Wrap",
      duration: "90 Minutes",
      priceUSD: 260,
      icon: "fa-water",
      description: "Full body organic sea kelp scrub followed by warm spirulina marine cocoon and deeply hydrating cold jade stone facial acupressure.",
      suitable: "Circulation, whole-body hydration, skin toning"
    },
    {
      id: "couples-serenity",
      title: "Couples Private Hydrotherapy & Massage Ritual",
      duration: "120 Minutes",
      priceUSD: 490,
      icon: "fa-heart",
      description: "Private cabana ritual including dual custom botanical aromatherapy massages, hydro-jet rose petal bath, and vintage champagne with strawberries.",
      suitable: "Romantic retreats, anniversaries, honeymoons"
    }
  ],

  amenities: [
    {
      icon: "fa-water-ladder",
      title: "Infinity Sky Pool",
      desc: "Heated multi-level cliffside pool that appears to spill endlessly into the horizon."
    },
    {
      icon: "fa-utensils",
      title: "Michelin Gastronomy",
      desc: "Three bespoke dining venues celebrating authentic flavors and international haute cuisine."
    },
    {
      icon: "fa-spa",
      title: "Imperial Roman Spa",
      desc: "2,000 m² wellness sanctuary featuring hydrothermal therapy, Turkish hamam & treatment pavilions."
    },
    {
      icon: "fa-ship",
      title: "Private Luxury Yacht",
      desc: "Complimentary sunset cruises and private charters to Capri, Positano, and secluded isles."
    },
    {
      icon: "fa-bell-concierge",
      title: "24/7 Royal Butler Service",
      desc: "Intuitive, discreet assistance for packing, dining bookings, private tours, and personalized requests."
    },
    {
      icon: "fa-helicopter",
      title: "Private Coastal Helipad",
      desc: "Seamless 15-minute VIP aerial transfers directly from Rome or Naples international hubs."
    },
    {
      icon: "fa-wine-glass",
      title: "Grand Wine Cave",
      desc: "Over 1,800 prestigious labels curated by master sommeliers with daily guided tastings."
    },
    {
      icon: "fa-dumbbell",
      title: "Technogym Wellness Hub",
      desc: "State-of-the-art sea-facing fitness club with private trainers, Pilates reformers & daily sunrise yoga."
    }
  ],

  reviews: [
    {
      id: 1,
      author: "Evelyn & Lord Alistair Sterling",
      location: "London, United Kingdom",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "October 2026",
      title: "The pinnacle of Mediterranean hospitality",
      comment: "We have visited luxury resorts worldwide for thirty years, but The Grand Horizon is in a class of its own. The cliffside views from the Presidential Penthouse take your breath away. Our butler, Marco, anticipated every desire before we even articulated it. Truly unforgettable.",
      verified: true
    },
    {
      id: 2,
      author: "Marc & Sophie Dupont",
      location: "Geneva, Switzerland",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "September 2026",
      title: "Culinary perfection and blissful serenity",
      comment: "L'Éclat alone deserves a trip to Italy. The saffron red prawn risotto paired with the 2018 vintage sommelier recommendation was transcendence. The infinity pool at sunset is the most magical place on earth.",
      verified: true
    },
    {
      id: 3,
      author: "Dr. Kenji & Mei Takahashi",
      location: "Tokyo, Japan",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "August 2026",
      title: "An exquisite sanctuary for our honeymoon",
      comment: "The Cliffside Villa gave us total privacy with world-class pampering. Waking up to the sea breeze, stepping into the crystal lagoon, and the 24K gold facial left us feeling thoroughly revitalized. We are already booking for our anniversary next year.",
      verified: true
    }
  ],

  specialOffers: [
    {
      id: "romance",
      tag: "Signature Romance",
      title: "Riviera Honeymoon & Romance Escape",
      discount: "Save 20%",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      perks: [
        "Chilled bottle of Moët & Chandon Rosé on arrival",
        "Private 2-hour Sunset Catamaran Cruise along Amalfi",
        "Romantic Candlelight 5-course degustation dinner",
        "Guaranteed 14:00 late check-out"
      ],
      code: "LOVEHORIZON"
    },
    {
      id: "extended",
      tag: "Extended Luxury",
      title: "Grand Mediterranean Stay (Stay 5, Pay 4)",
      discount: "1 Complimentary Night",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      perks: [
        "5 nights for the price of 4 across all suites & villas",
        "Daily Champagne Royale breakfast buffet for two",
        "$200 Resort Credit for Michelin dining or spa treatments",
        "Complimentary roundtrip luxury airport transfer"
      ],
      code: "STAY5PAY4"
    },
    {
      id: "wellness",
      tag: "Restorative Retreat",
      title: "Total Rejuvenation & Thermal Spa Journey",
      discount: "Curated Package",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      perks: [
        "Two daily signature 75-minute spa treatments per guest",
        "Private daily sunrise yoga and ocean meditation sessions",
        "Personalized organic wellness gastronomy menu",
        "Unlimited thermal hydrotherapy grotto access"
      ],
      code: "ZEN2026"
    }
  ],

  faqs: [
    {
      q: "What are your check-in and check-out times?",
      a: "Check-in begins at 15:00 and check-out is until 12:00. Early check-in and extended late check-out can be requested through our Concierge or selected as a complimentary perk when booking premium suites and villas."
    },
    {
      q: "How do I reach the resort from the nearest airport?",
      a: "We offer private chauffeured transfers in our Mercedes-Benz S-Class or Maybach fleet from Naples Capodichino International Airport (NAP, approx. 60 minutes) or Rome Fiumicino (FCO). For ultimate speed and scenic vistas, our private helipad welcomes guest helicopter arrivals in just 15 minutes."
    },
    {
      q: "What is your reservation and cancellation policy?",
      a: "Standard reservations enjoy complimentary cancellation or modification up to 72 hours prior to arrival. Non-refundable promotional rates and peak holiday stays have specific terms highlighted during booking."
    },
    {
      q: "Are children and families welcome?",
      a: "The Grand Horizon warmly welcomes guests of all ages. We feature dedicated family suites, private villas, custom children's culinary menus, and our supervised Petit Horizon Explorers Discovery Club."
    },
    {
      q: "Are pets allowed at the resort?",
      a: "We proudly welcome small to medium well-behaved pets (up to 15 kg). Our VIP Canine & Feline program provides plush orthopedic bedding, custom gourmet meals prepared by our culinary team, and dedicated coastal walking companions."
    },
    {
      q: "What is the dress code for dining venues?",
      a: "During daytime, resort casual attire is welcomed in all lounges and pool areas. For evening dining at L'Éclat and Saffron & Ember, elegant evening chic is appreciated (collared shirts and closed footwear for gentlemen; beachwear and athletic attire are politely restricted)."
    }
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.HOTEL_DATA = HOTEL_DATA;
}
