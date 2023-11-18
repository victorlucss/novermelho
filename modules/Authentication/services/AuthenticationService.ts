import { auth, googleProvider } from '@Configs/Firebase';

import User from '../interfaces/User.interface';

export default class AuthenticationService {
  constructor() {}

  static signIn(email: string, password: string): Promise<User> {
    return auth.signInWithEmailAndPassword(email, password).then(
      ({ user }) =>
        ({
          uid: user.uid,
        } as User)
    );
  }

  static signUp(email: string, password: string): Promise<User> {
    return auth.createUserWithEmailAndPassword(email, password).then(
      ({ user }) =>
        ({
          uid: user.uid,
        } as User)
    );
  }

  static forgotPassword(email: string): Promise<boolean> {
    return auth.sendPasswordResetEmail(email).then(_ => true);
  }

  static signInWithGoogle() {
    return auth.signInWithPopup(googleProvider);
  }
}
