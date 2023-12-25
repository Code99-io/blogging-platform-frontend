import { Route, Routes } from 'react-router-dom';
import { appRoutes } from '../constants';
import { Auth, Dashboard } from '../layout';
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  Home,
  MyAccount,
  Blogs,
  Categories,
  Tags,
  BlogCategories,
  BlogTags,
  Drafts,
  Comments,
  Likes,
  NotFoundPage,
} from '../pages';
import { AuthenticateGuard, UnAuthenticateGuard } from '../components/auth';

const AppRoutes = (): React.ReactElement => {
  return (
    <Routes>
      <Route element={<AuthenticateGuard />}>
        <Route element={<Dashboard />}>
          <Route path={appRoutes.HOME} element={<Home />} />
          <Route path={appRoutes.MY_ACCOUNT} element={<MyAccount />} />
          <Route path={appRoutes.BLOGS} element={<Blogs />} />
          <Route path={appRoutes.CATEGORIES} element={<Categories />} />
          <Route path={appRoutes.TAGS} element={<Tags />} />
          <Route
            path={appRoutes.BLOG_CATEGORIES}
            element={<BlogCategories />}
          />
          <Route path={appRoutes.BLOG_TAGS} element={<BlogTags />} />
          <Route path={appRoutes.DRAFTS} element={<Drafts />} />
          <Route path={appRoutes.COMMENTS} element={<Comments />} />
          <Route path={appRoutes.LIKES} element={<Likes />} />
        </Route>
      </Route>
      <Route element={<UnAuthenticateGuard />}>
        <Route element={<Auth />}>
          <Route path={appRoutes.LOGIN} element={<Login />} />
          <Route path={appRoutes.SIGN_UP} element={<Register />} />
          <Route
            path={appRoutes.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          />
          <Route path={appRoutes.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={appRoutes.EMAIL_VERIFY} element={<VerifyEmail />} />
        </Route>
      </Route>
      <Route
        path={appRoutes.NOT_FOUND_PAGE}
        element={
          <NotFoundPage
            title="404: Page Not Found"
            subTitle="The page you are looking for does not exist."
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
