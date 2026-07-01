export const ROUTES = {
  HOME: '/',
  CARS: '/cars',
  CAR_DETAILS: '/cars/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  GOOGLE_SUCCESS: '/auth/google/success',
  PROFILE: '/account/profile',
  MY_BOOKINGS: '/account/bookings',
  WISHLIST: '/account/wishlist',
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_CARS: '/owner/cars',
  OWNER_ADD_CAR: '/owner/cars/new',
  OWNER_EDIT_CAR: '/owner/cars/:id/edit',
  OWNER_BOOKINGS: '/owner/bookings',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKINGS: '/admin/bookings',
  NOT_FOUND: '*',
};

export const carIdRoute = (id) => `/cars/${id}`;
export const ownerEditCarRoute = (id) => `/owner/cars/${id}/edit`;
