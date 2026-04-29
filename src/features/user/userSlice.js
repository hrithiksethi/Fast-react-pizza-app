import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';

// Redux by nature is completely synchronous

/*

PROMISE
// When you create a new Promise, JavaScript gives you two functions:
// resolve(value) → marks the promise as fulfilled and passes value to whoever is awaiting or .then()-ing it.
// reject(error) → marks the promise as rejected and passes error to whoever is catching it.

GEOLOCATION

// Geolocation API expects two callbacks

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
Normally, you’d provide:

// A function to run when the location is successfully retrieved.
// A function to run if there’s an error (like permission denied).

// Passing resolve and reject directly
// Instead of writing custom functions, you hand over the promise’s resolve and reject:

// If geolocation succeeds, the API calls resolve(positionObj).
// → The promise becomes fulfilled, and await getPosition() returns the positionObj.

// If geolocation fails, the API calls reject(errorObj).
// → The promise becomes rejected, and await getPosition() throws that errorObj.

*/

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Using the thunk middleware to handle async logic in our action creators

// The createAsyncThunk function takes 2 args, first being the action type string or action name,
//  and the second being a payload creator function that returns a promise.
//  The createAsyncThunk function will automatically dispatch pending, fulfilled, and rejected actions based on the promise returned by the payload creator function.
//  The payload creator function can also take an optional second argument, which is an object containing additional options for the thunk.

export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    console.log(addressObj);
    // const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;
    const address = addressObj?.display_name;

    // 3) Then we return an object with the data that we are interested in
    return { position, address };
  },
);

const initialState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = 'idle';
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.error =
          'There was a problem getting your address. Make sure to fill this field';
        state.status = 'error';
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
