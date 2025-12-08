// Type stubs for modules not providing their own types
declare module 'react' {
  function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  function useContext<T = any>(context: any): T;
  function createContext<T = any>(defaultValue?: T): any;
  const Fragment: any;
  function memo<P>(Component: any): any;
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const ScrollView: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const Alert: any;
  export const StyleSheet: any;
  export const ActivityIndicator: any;
  export const FlatList: any;
  export const RefreshControl: any;
  export const NavigationContainer: any;
  export const createBottomTabNavigator: any;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export const useNavigation: any;
  export const useRoute: any;
}

declare module '@react-navigation/native-stack' {
  export function createNativeStackNavigator(): any;
}

declare module '@react-navigation/bottom-tabs' {
  export function createBottomTabNavigator(): any;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: any;
  export = AsyncStorage;
}

declare module '@react-native-picker/picker' {
  export const Picker: any;
}

declare module 'axios' {
  const axios: any;
  export = axios;
}

// Auth Context type
declare interface AuthContextType {
  user: any;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Global runtime declarations
declare var console: any;
declare var setInterval: any;
declare var clearInterval: any;
