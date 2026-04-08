// src/features/departments/departmentService.js
import axios from 'axios'

const API_URL = '/api/departments/'

const getDepartments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)
  return response.data
}

const createDepartment = async (departmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, departmentData, config)
  return response.data
}

const updateDepartment = async (id, departmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + id, departmentData, config)
  return response.data
}

const deleteDepartment = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + id, config)
  return response.data
}

const departmentService = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
}

export default departmentService
