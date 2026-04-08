import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import profileService from './profileService'
import { extractErrorMessage } from '../../utils'

const initialState = {
  profile: null,
  isLoading: false,
}

export const getProfile = createAsyncThunk(
  'profile/get',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await profileService.getProfile(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (profileData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await profileService.updateProfile(profileData, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export default profileSlice.reducer
