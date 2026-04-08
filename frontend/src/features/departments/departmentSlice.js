import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import departmentService from './departmentService'
import { extractErrorMessage } from '../../utils'

const initialState = {
  departments: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
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
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.departments = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to load departments'
        state.departments = []
      })

      .addCase(createDepartment.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload && typeof action.payload === 'object') {
          state.departments.unshift(action.payload)
        }
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to create department'
      })

      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload && action.payload._id) {
          state.departments = state.departments.map((dept) =>
            dept._id === action.payload._id ? action.payload : dept
          )
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to update department'
      })

      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.departments = state.departments.filter(
          (dept) => dept._id !== action.payload
        )
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to delete department'
      })
  },
})

export const { reset } = departmentSlice.actions
export default departmentSlice.reducer
