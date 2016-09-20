// @flow

import HomeComponent from './HomeComponent';
import SearchComponent from './SearchComponent';
import PersonalComponent from './PersonalComponent';

import LogoutBtn from './LogoutBtn';

export type Route = {
  title: ?string,
  component: any,
  showNav: boolean,
  showBack: boolean,
  rightButton: ?any,
};

const routes: { [key: string]: Route } = {
  home: {
    title: null,
    component: HomeComponent,
    showNav: false,
    showBack: false,
    rightButton: null,
  },
  search: {
    title: null,
    component: SearchComponent,
    showNav: false,
    showBack: false,
    rightButton: null,
  },
  personal: {
    title: '设置中心',
    component: PersonalComponent,
    showNav: true,
    showBack: true,
    rightButton: LogoutBtn,
  }
};

export default routes;
