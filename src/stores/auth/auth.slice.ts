import { CreateSliceType } from "stores/store.type";
import { AuthSlice, AUTH_STATE } from "./auth.slice.type";
import { defaultAuthSlice } from "./auth.slice.default";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "config/firebase.config";
import { UserDocument } from "api-calls/user/_user.type";
import { clearAnalyticsUser, setAnalyticsUser } from "lib/analytics.lib";
import { updateUserDoc } from "api-calls/user/updateUserDoc";
import { listenToUserDoc } from "api-calls/user/listenToUserDoc";
import { updateUserDocNestedFields } from "api-calls/user/updateUserDocNestedFields";

export const createAuthSlice: CreateSliceType<AuthSlice> = (set, getState) => ({
  ...defaultAuthSlice,

  subscribe: () => {
    return onAuthStateChanged(
      firebaseAuth,
      (user) => {
        set((state) => {
          if (user) {
            if (!user.displayName) {
              state.auth.userNameDialogOpen = true;
            }

            const userDoc: UserDocument = {
              displayName: user.displayName ?? "Unknown User",
            };

            if (user.photoURL) {
              userDoc.photoURL = user.photoURL;
            }

            setAnalyticsUser(user);
            updateUserDoc({ uid: user.uid, user: userDoc }).catch((e) => {
              console.error(e);
            });

            state.auth.user = user;
            state.auth.uid = user?.uid;
            state.auth.status = AUTH_STATE.AUTHENTICATED;
          } else {
            clearAnalyticsUser();
            state.auth.user = undefined;
            state.auth.uid = "";
            state.auth.status = AUTH_STATE.UNAUTHENTICATED;
          }
        });
      },
      (error) => {
        console.error(error);
        set((state) => {
          clearAnalyticsUser();
          state.auth.user = undefined;
          state.auth.uid = "";
          state.auth.status = AUTH_STATE.UNAUTHENTICATED;
        });
      }
    );
  },

  subscribeToUser: (uid) => {
    return listenToUserDoc(uid, (user) => {
      set((state) => {
        state.auth.userDoc = user;
      });
    });
  },

  closeUserNameDialog: () => {
    set((state) => {
      state.auth.userNameDialogOpen = false;
    });
  },

  updateUserDoc: (doc) => {
    const uid = getState().auth.uid;

    updateUserDocNestedFields({ uid, user: doc }).catch(() => {});
  },
});
