<template>
  <div class="login-container">
    <div class="login-overlay"></div>
    <div class="login-content">
      <div class="login-header">
        <div class="logo">
          <el-icon :size="40"><UploadFilled /></el-icon>
        </div>
        <h1>OTA 云端管理平台</h1>
        <p>IoT Device Firmware Management</p>
      </div>
      <el-card class="login-card">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="username">
            <el-input 
              v-model="form.username" 
              placeholder="请输入用户名" 
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              size="large"
              :prefix-icon="Lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              style="width: 100%" 
              :loading="loading" 
              @click="handleLogin"
            >
              <el-icon v-if="!loading" style="margin-right: 8px"><Key /></el-icon>
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="login-footer">
        <span>© 2026 OTA Cloud Design</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, UploadFilled, Key } from '@element-plus/icons-vue'
import { login } from '../api'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = ref({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    const { data } = await login(form.value)
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    ElMessage.success('登录成功')
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../assets/login-bg.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%);
  backdrop-filter: blur(3px);
}

.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #fff;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
}

.login-header h1 {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.login-header p {
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  margin: 0;
  letter-spacing: 2px;
}

.login-card {
  width: 420px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  backdrop-filter: blur(20px);
  background: rgba(255,255,255,0.95);
}

.login-card :deep(.el-card__header) {
  display: none;
}

.login-card :deep(.el-card__body) {
  padding: 40px;
}

.login-card :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 4px 12px;
}

.login-card :deep(.el-button--primary) {
  border-radius: 10px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #3a3a5a;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  transition: all 0.3s ease;
  color: #fff;
}

.login-card :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #2d2d44 0%, #1f3460 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border-color: #5a5a8a;
}

.login-card :deep(.el-button--primary:active) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.login-footer {
  margin-top: 30px;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
}
</style>
