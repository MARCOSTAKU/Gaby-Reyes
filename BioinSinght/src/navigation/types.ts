import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<BottomTabParamList> | undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Alerts: undefined;
  Evolution: undefined;
  Profile: undefined;
};
