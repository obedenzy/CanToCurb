export const WEEKDAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
];

export const INTEREST_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "residential", label: "Residential Service" },
  { value: "business", label: "Business Service" },
  { value: "enterprise", label: "Enterprise Plan" },
  { value: "support", label: "Customer Support" },
  { value: "other", label: "Other" },
];

export const PROPERTY_COUNT_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "1", label: "1" },
  { value: "2-5", label: "2-5" },
  { value: "6-10", label: "6-10" },
  { value: "11-20", label: "11-20" },
  { value: "21+", label: "21+" },
];

export const TRASH_CAN_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5+" },
];

export const PARTNERS = [
  { name: "Homes & Villas", logo: "HOMES+VILLAS" },
  { name: "iLoveVacations", logo: "ILOVEVACATIONS" },
  { name: "AvantStay", logo: "AVANTSTAY" },
  { name: "GoodNight", logo: "GOODNIGHT" },
  { name: "Marbella Lane", logo: "MARBELLA+LANE" },
  { name: "iTrip", logo: "ITRIP" },
  { name: "Lessen", logo: "LESSEN" },
  { name: "Casago", logo: "CASAGO" },
];

export const FEATURES = [
  {
    title: "Regular Service",
    description: "Weekly, bi-weekly, or monthly service options",
    icon: "Calendar"
  },
  {
    title: "Notifications",
    description: "Get alerts when your cans are moved",
    icon: "Bell"
  },
  {
    title: "Easy Billing",
    description: "Simple monthly or quarterly billing options",
    icon: "CreditCard"
  },
  {
    title: "Multiple Bins",
    description: "Trash, recycling, and yard waste support",
    icon: "Recycle"
  },
  {
    title: "Trusted Service",
    description: "Background-checked personnel for your peace of mind",
    icon: "Shield"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Choose a Plan",
    description: "Select a plan that fits your needs. Whether it's a single property or multiple properties, we've got you covered.",
    icon: "ListTodo"
  },
  {
    title: "We Take Out",
    description: "We show up at your home the day prior to collection day, take your trash and recycling cans out to the curb.",
    icon: "Trash2"
  },
  {
    title: "We Return",
    description: "After your trash is picked up, we return the cans to their designated location, so your property stays organized.",
    icon: "Undo2"
  }
];

export const FOOTER_LINKS = {
  products: [
    { label: "Pricing", href: "/pricing" },
    { label: "Vacation Rentals", href: "#" },
    { label: "Sure Home Warranty", href: "#" },
    { label: "OnDemand", href: "/on-demand" },
    { label: "Can Cleaning", href: "#" },
    { label: "Client Login", href: "/login" }
  ],
  resources: [
    { label: "Contact", href: "/contact" },
    { label: "Talk to Sales", href: "/contact" },
    { label: "Coverage Area", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Blog", href: "#" }
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Earn CanRunning", href: "#" },
    { label: "Affiliates", href: "#" },
    { label: "Merch", href: "#" }
  ],
  legal: [
    { label: "Terms & Conditions", href: "#" },
    { label: "CanRunner Terms", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Do Not Sell My Information", href: "#" }
  ]
};
