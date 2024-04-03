import AuthLayout from '@/layouts/AuthLayout';
import BaseLayout from '@/layouts/BaseLayout';

import { ROUTER } from '@/configs/router';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import Page403 from '@/pages/Error/403';
import { Requests } from '@/pages/Request';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import Department from '../pages/Department';
import { DepartmentDetails } from '../pages/DepartmentDetails';
import Page404 from '../pages/Error/404';
import { Home } from '../pages/Home';
import Login from '../pages/Login';
import { Permission } from '../pages/Permission';
import { Profile } from '../pages/Profile';
import { Role } from '../pages/Role';
import { RoleDetails } from '../pages/RoleDetails';
import { TimeOff } from '../pages/TimeOff';
import { User } from '../pages/User';
import { UserDetails } from '../pages/UserDetails';
import { News } from '@/pages/News';
import { CreateNewsPage } from '@/pages/News/components/CreateNewPage';
import { MyNews } from '@/pages/MyNews';
import { MyAttendance } from '@/pages/MyAttendance';
import { Attendance } from '@/pages/Attendance';
import { UpdateNewsPage } from '@/pages/News/components/UpdateNewPage';
import { Session } from '@/pages/Session';

const router = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<BaseLayout />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTER.LOGIN} element={<Login />} />
        </Route>
        <Route path={ROUTER.BASE} element={<ProtectedLayout />}>
          <Route path={ROUTER.BASE} element={<Home />} />
          <Route path={ROUTER.PROFILE} element={<Profile />} />
          <Route path={ROUTER.TIME_OFF} element={<TimeOff />} />
          <Route path={ROUTER.DEPARTMENT} element={<Department />} />
          <Route
            path={ROUTER.DEPARTMENT_DETAILS}
            element={<DepartmentDetails />}
          />
          <Route path={ROUTER.USER} element={<User />} />
          <Route path={ROUTER.USER_DETAILS} element={<UserDetails />} />
          <Route path={ROUTER.ROLE} element={<Role />} />
          <Route path={ROUTER.ROLE_DETAILS} element={<RoleDetails />} />
          <Route path={ROUTER.PERMISSION} element={<Permission />} />
          <Route path={ROUTER.REQUEST} element={<Requests />} />
          <Route path={ROUTER.NEWS} element={<News />} />
          <Route path={ROUTER.CREATE_NEWS} element={<CreateNewsPage />} />
          <Route path={ROUTER.DETAILS_NEWS} element={<UpdateNewsPage />} />
          <Route path={ROUTER.MY_NEWS} element={<MyNews />} />
          <Route path={ROUTER.MY_ATTENDANCE} element={<MyAttendance />} />
          <Route path={ROUTER.ATTENDANCE} element={<Attendance />} />
          <Route path={ROUTER.SESSION} element={<Session />} />
          <Route path={ROUTER.UNAUTHORIZE} element={<Page403 />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Route>
    )
  );
};

export default router;
