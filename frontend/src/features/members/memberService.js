// src/features/members/memberService.js
import axios from 'axios'

const API_URL = '/api/members/'

const createMember = async (memberData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, memberData, config)
  return response.data
}

const getMembers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)
  return response.data
}

const updateMember = async (id, memberData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + id, memberData, config)
  return response.data
}

const deleteMember = async (memberId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + memberId, config)
  return response.data
}

const memberService = {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
}

export default memberService
