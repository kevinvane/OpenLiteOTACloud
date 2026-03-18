<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">OTA管理平台</div>
      <el-menu
        :default-active="route.path"
        router
        class="menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/models">
          <el-icon><Cpu /></el-icon>
          <span>型号管理</span>
        </el-menu-item>
        <el-menu-item index="/firmwares">
          <el-icon><FolderOpened /></el-icon>
          <span>固件管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span class="username">{{ username }}</span>
        <el-button type="danger" link @click="handleLogout">退出</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const username = computed(() => localStorage.getItem('username') || '')

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style scoped>
.layout-container { height: 100vh; }
.el-aside { background: #304156; }
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
.menu { border: none; background: #304156; }
.menu .el-menu-item { color: #bfcbd9; }
.menu .el-menu-item:hover, .menu .el-menu-item.is-active { background: #263445; color: #409eff; }
.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
}
.username { margin-right: 20px; color: #333; }
</style>
