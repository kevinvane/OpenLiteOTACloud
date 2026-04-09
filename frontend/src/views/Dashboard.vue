<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>固件总数</template>
          <div class="stat-number">{{ stats.totalFirmware }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>型号总数</template>
          <div class="stat-number">{{ stats.totalModel }}</div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>型号分布</template>
          <el-table :data="stats.modelDistribution" max-height="300">
            <el-table-column prop="model_name" label="型号" />
            <el-table-column prop="count" label="固件数量" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>最新版本</template>
          <el-table :data="stats.latestVersions" max-height="300">
            <el-table-column prop="model_name" label="型号" />
            <el-table-column prop="version" label="版本" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>下载排行 Top 10</template>
          <el-table :data="stats.topDownloads">
            <el-table-column prop="model" label="型号" />
            <el-table-column prop="check_count" label="升级检查次数" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboard } from '../api'
import { ElMessage } from 'element-plus'

const stats = ref({
  totalFirmware: 0,
  totalModel: 0,
  modelDistribution: [],
  latestVersions: [],
  topDownloads: [],
})

const fetchData = async () => {
  try {
    const { data } = await getDashboard()
    stats.value = data
  } catch (e) {
    ElMessage.error('获取数据失败')
  }
}

onMounted(fetchData)
</script>

<style scoped>
.stat-number {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #409eff;
}
</style>
