import firebase from '@react-native-firebase/app';
import {GoogleSignin} from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import {put, call, select, takeEvery} from 'redux-saga/effects';
import {showMessage} from 'react-native-flash-message';
import {handleError} from 'src/utils/error';

import languages from 'src/locales';

import * as Actions from './constants';

import {userIdSelector} from './selectors';
import {
  loginWithEmail,
  loginWithMobile,
  registerWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  changeEmail,
  changePassword,
  forgotPassword,
  updateCustomer,
  getCustomer,
  loginWithApple,
} from './service';

import {
  validatorSignIn,
  validatorRegister,
  validatorForgotPassword,
  validatorChangePassword,
} from './validator';
import {validatorAddress} from '../cart/validator';

import {languageSelector, requiredLoginSelector} from '../common/selectors';

import NavigationService from 'src/utils/navigation';
import {rootSwitch} from 'src/config/navigator';
import {shippingAddressInit} from './config';

async function signOut() {
  // Sign Out Firebase
  await firebase.auth().signOut();
  // Sign Out Google
  await GoogleSignin.revokeAccess();
  await GoogleSignin.signOut();
}

/**
 * Do login success
 * @param token
 * @param user
 * @returns {IterableIterator<*>}
 */
function* doLoginSuccess(token, user = {}) {
  yield put({
    type: Actions.SIGN_IN_WITH_EMAIL_SUCCESS,
    payload: {token, user},
  });
  yield put({
    type: Actions.GET_SHIPPING_ADDRESS,
    payload: user.ID,
  });
  yield call(NavigationService.navigate, rootSwitch.main);
  yield call(AsyncStorage.setItem, 'token', token);
}

/**
 * Sign In saga
 * @param username
 * @param password
 * @returns {IterableIterator<*>}
 */
function* signInWithEmailSaga({username, password}) {
  try {
    const language = yield select(languageSelector);
    const {token, user} = yield call(loginWithEmail, {username, password, language});
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    // yield call(handleError, e)
    yield put({
      type: Actions.SIGN_IN_WITH_EMAIL_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign In mobile saga
 * @param tokenId
 * @returns {IterableIterator<*>}
 */
function* signInWithMobileSaga({tokenId}) {
  try {
    const {token, user} = yield call(loginWithMobile, tokenId);
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.SIGN_IN_WITH_MOBILE_ERROR,
    });
  }
}

/**
 * Sign up with email
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* signUpWithEmailSaga({payload}) {
  try {
    const {data} = payload;
    const language = yield select(languageSelector);
    const {token, user} = yield call(registerWithEmail, data);
    yield call(showMessage, {
      message: languages[language].notifications.text_create_user_success,
      type: 'info',
    });
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_UP_WITH_EMAIL_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign in with google
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithGoogleSaga({payload}) {
  try {
    const {idToken} = payload;
    const {token, user} = yield call(loginWithGoogle, { idToken });
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_GOOGLE_ERROR,
    });
  }
}

/**
 * Sign in with Google
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithFacebookSaga({payload}) {
  try {
    const {data} = payload;
    const {token, user} = yield call(loginWithFacebook, data);
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_FACEBOOK_ERROR,
    });
  }
}

/**
 * Sign in with Apple
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithAppleSaga({payload}) {
  try {
    const {token, user} = yield call(loginWithApple, payload);
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_FACEBOOK_ERROR,
    });
  }
}

function* forgotPasswordSideEffect(action) {
  try {
    const language = yield select(languageSelector);
    const errors = validatorForgotPassword(action.email, language);
    if (errors.size > 0) {
      yield put({
        type: Actions.FORGOT_PASSWORD_ERROR,
        payload: {
          message: languages[language].notifications.text_fill_value,
          errors: errors.toJS(),
        },
      });
    } else {
      yield call(forgotPassword, action.email);
      yield put({
        type: Actions.FORGOT_PASSWORD_SUCCESS,
      });
      yield call(showMessage, {
        message: languages[language].notifications.text_forgot_password_success,
        type: 'info',
      });
    }
  } catch (e) {
    yield put({
      type: Actions.FORGOT_PASSWORD_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

// function* checkAuthSideEffect() {
//   try {
//     yield call(checkAuth);
//     yield put(checkAuthSucceeded());
//     yield put(fetchProfile());
//     yield put(fetchLocations());
//   } catch (e) {
//     yield put(unsubscribeNotifications());
//     yield put(checkAuthFailed(e.message));
//   }
// }
//

/**
 * Change Email Saga
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* changeEmailSaga({payload}) {
  try {
    yield call(changeEmail, payload);
    yield put({type: Actions.CHANGE_EMAIL_SUCCESS});
  } catch (e) {
    yield call(handleError, e);
    yield put({type: Actions.CHANGE_EMAIL_ERROR});
  }
}

/**
 * Change Password Saga
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* changePasswordSaga({payload}) {
  try {
    const language = yield select(languageSelector);
    const errors = validatorChangePassword(payload, language);
    if (errors.size > 0) {
      yield put({
        type: Actions.CHANGE_PASSWORD_ERROR,
        payload: {
          message: languages[language].notifications.text_fill_value,
          errors: errors.toJS(),
        },
      });
    } else {
      const data = {
        password_old: payload.password_old,
        password_new: payload.password_new,
      };
      yield call(changePassword, data);
      yield put({
        type: Actions.CHANGE_PASSWORD_SUCCESS,
      });
      yield call(showMessage, {
        message: languages[language].notifications.text_change_password_success,
        type: 'info',
      });
    }
  } catch (e) {
    yield put({
      type: Actions.CHANGE_PASSWORD_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign out saga
 * @returns {IterableIterator<*>}
 */
function* signOutSaga() {
  try {
    const requiredLogin = yield select(requiredLoginSelector);
    yield call(AsyncStorage.removeItem, 'token');
    if (requiredLogin) {
      yield call(NavigationService.navigate, rootSwitch.auth);
    }
    // yield call(logout);
    yield put({type: Actions.SIGN_OUT_SUCCESS});
    // yield call(
    //   navigationService.navigate,
    //   screens.Auth.AuthStack.WelcomeScreen._name
    // );
    // Try logout Firebase
    yield call(signOut);
  } catch (e) {
    console.log(e);
    // yield call(handleError, e);
  }
}
/**
 * Get shipping address
 * @returns {IterableIterator<*>}
 */
function* getShippingAddressSaga({payload}) {
  try {
    const customer = yield call(getCustomer, payload);
    yield put({
      type: Actions.GET_SHIPPING_ADDRESS_SUCCESS,
      payload: customer.shipping || shippingAddressInit,
    });
  } catch (e) {
    yield put({
      type: Actions.GET_SHIPPING_ADDRESS_ERROR,
      payload: shippingAddressInit,
    });
  }
}

/**
 * Update shipping address
 * @returns {IterableIterator<*>}
 */
function* updateShippingAddressSaga({payload}) {
  try {
    const userID = yield select(userIdSelector);
    const errors = validatorAddress(payload);
    if (errors.size > 0) {
      yield put({
        type: Actions.UPDATE_SHIPPING_ADDRESS_ERROR,
        payload: {
          message: 'Fill inputs',
          errors: errors.toJS(),
        },
      });
    } else {
      yield call(updateCustomer, userID, {
        shipping: payload,
      });
      yield put({
        type: Actions.UPDATE_SHIPPING_ADDRESS_SUCCESS,
        payload,
      });
      yield call(showMessage, {
        message: 'Update success',
        type: 'success',
      });
    }
  } catch (e) {
    yield put({
      type: Actions.UPDATE_SHIPPING_ADDRESS_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

export default function* authSaga() {
  yield takeEvery(Actions.SIGN_IN_WITH_EMAIL, signInWithEmailSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_MOBILE, signInWithMobileSaga);
  yield takeEvery(Actions.SIGN_UP_WITH_EMAIL, signUpWithEmailSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_GOOGLE, signInWithGoogleSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_FACEBOOK, signInWithFacebookSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_APPLE, signInWithAppleSaga);
  yield takeEvery(Actions.SIGN_OUT, signOutSaga);
  yield takeEvery(Actions.CHANGE_EMAIL, changeEmailSaga);
  yield takeEvery(Actions.CHANGE_PASSWORD, changePasswordSaga);
  yield takeEvery(Actions.FORGOT_PASSWORD, forgotPasswordSideEffect);
  yield takeEvery(Actions.GET_SHIPPING_ADDRESS, getShippingAddressSaga);
  yield takeEvery(Actions.UPDATE_SHIPPING_ADDRESS, updateShippingAddressSaga);
}
