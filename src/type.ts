export type RootStackParamList = {
  MainStack: undefined;
  AuthStack: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: { truckNumber: string };
  forgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  OrderHistory: undefined;
  Settings: undefined;
};
