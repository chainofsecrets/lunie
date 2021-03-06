import config from "src/../config"
import firebase from "../../firebase.js"
import * as Sentry from "@sentry/browser"

const Auth = firebase.auth()

export default () => {
  const state = {
    userSignedIn: false,
    user: null,
    signInError: null,
    externals: {
      config,
    },
  }

  const mutations = {
    userSignedIn(state, hasSignedIn) {
      state.userSignedIn = hasSignedIn
    },
    setUserInformation(state, user) {
      state.user = user
    },
    setSignInError(state, error) {
      state.signInError = error
    },
  }

  const actions = {
    async listenToAuthChanges({ commit }) {
      await Auth.onAuthStateChanged((user) => {
        if (user) {
          commit(`userSignedIn`, true)
          commit(`setUserInformation`, user)
          console.log("User is now signed in!")
        } else {
          commit(`userSignedIn`, false)
          commit(`setUserInformation`, null)
          console.log("User is now signed out!")
        }
      })
    },
    async signInUser({ commit }) {
      if (Auth.isSignInWithEmailLink(window.location.href)) {
        const user = JSON.parse(localStorage.getItem(`user`))
        try {
          await Auth.signInWithEmailLink(user.email, window.location.href)
        } catch (error) {
          console.error(error)
          commit(`setSignInError`, error)
          Sentry.captureException(error)
        }
      }
    },
    async sendUserMagicLink({ commit }, { user }) {
      const actionCodeSettings = {
        url: `${window.location.protocol}//${window.location.host}/email-authentication`,
        handleCodeInApp: true,
      }
      try {
        await Auth.sendSignInLinkToEmail(user.email, actionCodeSettings)
        localStorage.setItem("user", JSON.stringify(user))
        console.log("Magic link sent to your email!")
      } catch (error) {
        console.error(error)
        commit(`setSignInError`, error)
        Sentry.captureException(error)
      }
    },
    async signOutUser({ commit }) {
      try {
        await Auth.signOut()
      } catch (error) {
        console.error(error)
        commit(`setSignInError`, error)
        Sentry.captureException(error)
      }
    },
  }

  return {
    state,
    mutations,
    actions,
  }
}
