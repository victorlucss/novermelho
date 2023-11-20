import { auth, firestore, googleProvider } from '@Configs/Firebase';
import { createDefaultCategories } from '@Modules/Category/helpers/createDefaultCategories';

interface IGoogleProviderProfile {
  email?: string;
  family_name?: string;
  given_name?: string;
  granted_scopes?: string;
  id?: string;
  locale?: string;
  name?: string;
  picture?: string;
}

export const signInWithGoogle = () => {
  return auth.signInWithPopup(googleProvider).then(async ({ additionalUserInfo, user }) => {
    if (additionalUserInfo.isNewUser) {
      const profile = additionalUserInfo.profile as IGoogleProviderProfile;

      await firestore
        .collection('user')
        .doc(user.uid)
        .set({
          email: profile?.email,
          name: `${profile?.given_name} ${profile?.family_name}`,
          locale: profile?.locale,
          image: profile?.picture,
        })
        .then(() => createDefaultCategories(user.uid));
    }
    return user.uid;
  });
};
