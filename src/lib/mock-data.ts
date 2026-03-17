/**
 * Mock data for local development preview.
 * Used when MONGODB_URI is not set, so `pnpm dev` shows a working site
 * without any external services.
 */

export const MOCK_DISHES = [
  {
    _id: "mock-dish-001",
    name: "Goat Pepper Soup",
    description:
      "Slow-simmered goat meat in a fiery, aromatic broth with traditional Nigerian spices. Tender, rich, and deeply satisfying.",
    price: 5000,
    image_url:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80",
    category: "Pepper Soup",
    available_sides: ["Boiled Yam", "Fried Plantain", "White Rice", "None"],
    is_active: true,
    created_at: new Date("2026-01-15"),
    updated_at: new Date("2026-01-15"),
  },
  {
    _id: "mock-dish-002",
    name: "Catfish Pepper Soup",
    description:
      "Fresh catfish fillets swimming in a bold, peppery broth infused with uziza leaves and scent leaf. A Lagos favourite.",
    price: 4500,
    image_url:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80",
    category: "Pepper Soup",
    available_sides: ["Boiled Yam", "Fried Plantain", "White Rice", "None"],
    is_active: true,
    created_at: new Date("2026-01-15"),
    updated_at: new Date("2026-01-15"),
  },
  {
    _id: "mock-dish-003",
    name: "Chicken Pepper Soup",
    description:
      "Free-range chicken pieces in a light, fragrant pepper broth. Gentle heat with a burst of ginger and calabash nutmeg.",
    price: 4000,
    image_url:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    category: "Pepper Soup",
    available_sides: ["Boiled Yam", "Fried Plantain", "White Rice", "None"],
    is_active: true,
    created_at: new Date("2026-01-15"),
    updated_at: new Date("2026-01-15"),
  },
];

export const MOCK_ORDERS = [
  {
    _id: "mock-order-001",
    reference: "HP-73921",
    user_id: null,
    customer_name: "Adaeze Okafor",
    customer_phone: "08012345678",
    customer_email: "adaeze@example.com",
    address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    notes: "Please call when arriving at the gate",
    items: [
      {
        menu_item_id: "mock-dish-001",
        menu_item_name: "Goat Pepper Soup",
        side: "Boiled Yam",
        quantity: 2,
        unit_price: 5000,
      },
      {
        menu_item_id: "mock-dish-003",
        menu_item_name: "Chicken Pepper Soup",
        side: "Fried Plantain",
        quantity: 1,
        unit_price: 4000,
      },
    ],
    total_price: 14000,
    status: "pending",
    notification_status: "sent",
    party_service_inquiry: false,
    location_meta: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    _id: "mock-order-002",
    reference: "HP-58104",
    user_id: null,
    customer_name: "Chinedu Eze",
    customer_phone: "07034567890",
    customer_email: null,
    address: "45 Allen Avenue, Ikeja, Lagos",
    notes: null,
    items: [
      {
        menu_item_id: "mock-dish-002",
        menu_item_name: "Catfish Pepper Soup",
        side: "White Rice",
        quantity: 3,
        unit_price: 4500,
      },
    ],
    total_price: 13500,
    status: "contacted",
    notification_status: "sent",
    party_service_inquiry: false,
    location_meta: null,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    _id: "mock-order-003",
    reference: "HP-29847",
    user_id: null,
    customer_name: "Funke Akindele",
    customer_phone: "09087654321",
    customer_email: "funke@example.com",
    address: "8 Bourdillon Road, Ikoyi, Lagos",
    notes: "Catering inquiry - birthday party for 30 guests",
    items: [
      {
        menu_item_id: "mock-dish-001",
        menu_item_name: "Goat Pepper Soup",
        side: "Fried Plantain",
        quantity: 10,
        unit_price: 5000,
      },
      {
        menu_item_id: "mock-dish-002",
        menu_item_name: "Catfish Pepper Soup",
        side: "Boiled Yam",
        quantity: 10,
        unit_price: 4500,
      },
      {
        menu_item_id: "mock-dish-003",
        menu_item_name: "Chicken Pepper Soup",
        side: "White Rice",
        quantity: 10,
        unit_price: 4000,
      },
    ],
    total_price: 135000,
    status: "pending",
    notification_status: "failed",
    party_service_inquiry: true,
    location_meta: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    updated_at: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    _id: "mock-order-004",
    reference: "HP-61532",
    user_id: null,
    customer_name: "Emeka Nwosu",
    customer_phone: "08109876543",
    customer_email: "emeka.n@example.com",
    address: "22 Awolowo Road, Falomo, Ikoyi, Lagos",
    notes: null,
    items: [
      {
        menu_item_id: "mock-dish-001",
        menu_item_name: "Goat Pepper Soup",
        side: "None",
        quantity: 1,
        unit_price: 5000,
      },
    ],
    total_price: 5000,
    status: "completed",
    notification_status: "sent",
    party_service_inquiry: false,
    location_meta: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
];

export const MOCK_CATERING_SERVICES = [
  {
    _id: "mock-catering-001",
    name: "Birthday Parties",
    slug: "birthday",
    description: "Make their special day unforgettable with premium pepper soup catering.",
    starting_price: 50000,
    image_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    includes: [
      "Full catering setup",
      "Dedicated serving staff",
      "Premium bowls & utensils",
      "Up to 3 pepper soup varieties",
      "Choice of side dishes",
      "Post-event cleanup",
    ],
    highlights: [
      "Perfect for 20-100 guests",
      "Customizable menu options",
      "Setup 2 hours before event",
      "Indoor & outdoor events",
    ],
    is_active: true,
    sort_order: 1,
  },
  {
    _id: "mock-catering-002",
    name: "Corporate Events",
    slug: "corporate",
    description: "Impress clients and colleagues with a taste of authentic Lagos.",
    starting_price: 100000,
    image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    includes: [
      "Professional event coordination",
      "Branded service stations",
      "Full cutlery & crockery",
      "All pepper soup varieties",
      "Extensive side dish selection",
      "Setup & teardown crew",
    ],
    highlights: [
      "Ideal for 50-500 guests",
      "Boardroom lunches to gala dinners",
      "Professional uniformed staff",
      "Corporate branding options",
    ],
    is_active: true,
    sort_order: 2,
  },
  {
    _id: "mock-catering-003",
    name: "Wedding Receptions",
    slug: "wedding",
    description: "A culinary experience worthy of your most important day.",
    starting_price: 200000,
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    includes: [
      "Dedicated event manager",
      "Elegant service setup",
      "Premium tableware",
      "Full menu with all varieties",
      "Complete side dish buffet",
      "Pre-event tasting session",
      "Full cleanup",
    ],
    highlights: [
      "Perfect for 100-1000+ guests",
      "Tasting session included",
      "Elegant presentation",
      "Coordinated with your wedding planner",
    ],
    is_active: true,
    sort_order: 3,
  },
  {
    _id: "mock-catering-004",
    name: "Private Dining",
    slug: "private-dining",
    description: "An intimate chef-driven experience in the comfort of your home.",
    starting_price: 30000,
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    includes: [
      "Personal chef experience",
      "Intimate table setup",
      "Premium utensils",
      "Choice of 2 pepper soup varieties",
      "Selected sides",
      "Personalized service",
    ],
    highlights: [
      "Ideal for 2-20 guests",
      "Chef prepares at your location",
      "Wine pairing available",
      "Perfect for date nights & family gatherings",
    ],
    is_active: true,
    sort_order: 4,
  },
];

/**
 * Admin dashboard mock stats
 */
export function getMockDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = MOCK_ORDERS.filter(
    (o) => new Date(o.created_at) >= today
  );
  const pendingOrders = MOCK_ORDERS.filter((o) => o.status === "pending");
  const failedNotifications = MOCK_ORDERS.filter(
    (o) => o.notification_status === "failed"
  );

  return {
    todayOrdersCount: todayOrders.length,
    pendingCount: pendingOrders.length,
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.total_price, 0),
    failedNotificationsCount: failedNotifications.length,
  };
}

/**
 * Check if we're in mock mode (no MongoDB configured)
 */
export function isMockMode(): boolean {
  return !process.env.MONGODB_URI;
}
