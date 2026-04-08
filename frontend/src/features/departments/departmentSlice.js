// src/features/departments/departmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import departmentService from './departmentService'
import { extractErrorMessage } from '../../utils'

const initialState = {
  departments: [],
  isLoading: false,
}

export const getDepartments = createAsyncThunk(
  'departments/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.getDepartments(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.createDepartment(departmentData, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, departmentData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.updateDepartment(id, departmentData, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      await departmentService.deleteDepartment(id, token)
      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false
        state.departments = action.payload
      })
      .addCase(getDepartments.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.unshift(action.payload)
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.map((dept) =>
          dept._id === action.payload._id ? action.payload : dept
        )
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter(
          (dept) => dept._id !== action.payload
        )
      })
  },
})

export default departmentSlice.reducer
