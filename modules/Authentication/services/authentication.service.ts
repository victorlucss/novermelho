import { auth, firestore, googleProvider } from '@Configs/Firebase';

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
  return auth.signInWithPopup(googleProvider).then(({ additionalUserInfo, user }) => {
    if (additionalUserInfo.isNewUser) {
      const profile = additionalUserInfo.profile as IGoogleProviderProfile;

      firestore.collection('user').add({
        email: profile?.email,
        name: `${profile?.given_name} ${profile?.family_name}`,
        locale: profile?.locale,
        image: profile?.picture,
      });
    }
    return user.uid;
  });
};
