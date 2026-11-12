import { firebaseAuth } from '../../firebase/BaseConfig';
import { createContext } from 'react';

export const AuthContext = createContext<IAuth>({
 user: firebaseAuth.currentUser,
 loading: false,
 signIn: () => {},
 signUp: () => {},
 signOut: () => {},
});