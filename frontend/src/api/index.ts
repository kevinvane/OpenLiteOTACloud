import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 60 * 10000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const { code, message } = response.data
    if (code !== 0) {
      ElMessage.error(message || '请求失败')
      if (code === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(new Error(message))
    }
    return response.data
  },
  (error) => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request

export const login = (data: { username: string; password: string }) => 
  request.post('/auth/login', data)

export const getModels = (params?: { page?: number; pageSize?: number; status?: number }) =>
  request.get('/admin/models', { params })

export const createModel = (data: { name: string; description?: string }) =>
  request.post('/admin/models', data)

export const updateModel = (id: number, data: { name: string; description?: string; status?: number }) =>
  request.put(`/admin/models/${id}`, data)

export const deleteModel = (id: number) => request.delete(`/admin/models/${id}`)

export const getFirmwares = (params?: { page?: number; pageSize?: number; modelId?: number }) =>
  request.get('/admin/firmwares', { params })

export const getModelOptions = () => request.get('/admin/firmwares/options')

export const uploadFirmware = (data: FormData) =>
  request.post('/admin/firmwares', data, { headers: { 'Content-Type': 'multipart/form-data' } })

export const deleteFirmware = (id: number) => request.delete(`/admin/firmwares/${id}`)

export const getDashboard = () => request.get('/admin/dashboard')
