import { auth } from '@Configs/Firebase';

import { User } from '../interfaces/User.interface';

export default class AuthenticationService {
  constructor() {}

  static signIn(email: string, password: string): Promise<User | void> {
    return auth.signInWithEmailAndPassword(email, password).then(
      ({ user }) =>
        ({
          uid: user.uid,
        } as User)
    );
  }

  static signUp(email: string, password: string): Promise<User | void> {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(
        ({ user }) =>
          ({
            uid: user.uid,
          } as User)
      )
      .catch(error => error);
  }

  static forgotPassword(email: string): Promise<boolean | void> {
    return auth
      .sendPasswordResetEmail(email)
      .then(_ => true)
      .catch(error => error);
  }
}
