export const ROUTES = {
  // ==========================
  // Public
  // ==========================

  HOME: '/',
  CARS: '/cars',
  CAR_DETAILS: '/cars/:id',

  // ==========================
  // Authentication
  // ==========================

  LOGIN: '/login',
  REGISTER: '/register',
  GOOGLE_SUCCESS: '/auth/google/success',
  SELECT_ROLE: '/auth/select-role',

  // ==========================
  // Customer
  // ==========================

  CUSTOMER_DASHBOARD: '/account/dashboard',
  ACTIVE_RENTAL: '/account/active-rental',
  MY_BOOKINGS: '/account/bookings',
  WISHLIST: '/account/wishlist',

  // ==========================
  // Owner
  // ==========================

  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_CARS: '/owner/cars',
  OWNER_ADD_CAR: '/owner/cars/new',
  OWNER_EDIT_CAR: '/owner/cars/:id/edit',
  OWNER_BOOKINGS: '/owner/bookings',

  // ==========================
  // Admin
  // ==========================

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CARS: '/admin/cars',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKINGS: '/admin/bookings',

  // ==========================
  // Misc
  // ==========================

  NOT_FOUND: '*',
};

// ==========================
// Dynamic Routes
// ==========================

export const carDetailsRoute = (id) => `/cars/${id}`;
export const carIdRoute = carDetailsRoute;

export const ownerEditCarRoute = (id) => `/owner/cars/${id}/edit`;