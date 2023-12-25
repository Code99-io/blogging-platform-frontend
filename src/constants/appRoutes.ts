// Auth Routes
const LOGIN = '/login';
const SIGN_UP = '/register';
const FORGOT_PASSWORD = '/forgot-password';
const RESET_PASSWORD = '/reset-password';
const EMAIL_VERIFY = '/verify-email';

// Authorized Routes
const HOME = '/';
const MY_ACCOUNT = '/my-account';

// Modules
const BLOGS = '/blogs';
const CATEGORIES = '/categories';
const TAGS = '/tags';
const BLOG_CATEGORIES = '/blogCategories';
const BLOG_TAGS = '/blogTags';
const DRAFTS = '/drafts';
const COMMENTS = '/comments';
const LIKES = '/likes';

const NOT_FOUND_PAGE = '*';

export default {
  // Auth
  LOGIN,
  SIGN_UP,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  EMAIL_VERIFY,

  // Dashboard
  HOME,
  MY_ACCOUNT,

  // Modules
  BLOGS,
  CATEGORIES,
  TAGS,
  BLOG_CATEGORIES,
  BLOG_TAGS,
  DRAFTS,
  COMMENTS,
  LIKES,

  NOT_FOUND_PAGE,
};
