<template>
  <div class="firmwares-page">
    <el-card>
      <template #header>
        <div class="header">
          <span>固件管理</span>
          <el-button type="primary" @click="handleAdd">上传固件</el-button>
        </div>
      </template>
      
      <el-table :data="list" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="model_name" label="型号" />
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="file_size" label="大小" width="120">
          <template #default="{ row }">
            {{ (row.file_size / 1024).toFixed(2) }} KB
          </template>
        </el-table-column>
        <el-table-column prop="file_md5" label="MD5" width="150" show-overflow-tooltip />
        <el-table-column prop="download_count" label="下载次数" width="100" />
        <el-table-column label="上传时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: flex-end"
        @current-change="fetchList"
      />
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="上传固件" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="选择型号" prop="modelId">
          <el-select v-model="form.modelId" placeholder="请选择型号" style="width: 100%">
            <el-option v-for="item in modelOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="如: 1.0.0" />
        </el-form-item>
        <el-form-item label="版本描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="选择文件" prop="file">
          <el-upload ref="_uploadRef" :auto-upload="false" :limit="1" :on-change="handleFileChange">
            <el-button>选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 .bin, .hex 格式文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">上传</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirmwares, getModelOptions, uploadFirmware, deleteFirmware } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref()
const _uploadRef = ref<any>()
const modelOptions = ref<{ id: number; name: string }[]>([])
const form = ref({ modelId: '', version: '', description: '', file: null as File | null })
const rules = {
  modelId: [{ required: true, message: '请选择型号', trigger: 'change' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
}

const fetchList = async () => {
  loading.value = true
  try {
    const { data } = await getFirmwares({ page: page.value, pageSize: pageSize.value })
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const fetchOptions = async () => {
  const { data } = await getModelOptions()
  modelOptions.value = data
}

const handleAdd = async () => {
  await fetchOptions()
  form.value = { modelId: '', version: '', description: '', file: null }
  _uploadRef.value?.clearFiles()
  dialogVisible.value = true
}

const handleFileChange = (file: any) => {
  form.value.file = file.raw
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (!form.value.file) {
    return ElMessage.warning('请选择文件')
  }
  
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('modelId', form.value.modelId)
    formData.append('version', form.value.version)
    formData.append('description', form.value.description)
    formData.append('file', form.value.file)
    
    await uploadFirmware(formData)
    ElMessage.success('上传成功')
    dialogVisible.value = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm('确定删除该固件吗？', '提示', { type: 'warning' })
  try {
    await deleteFirmware(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; }
</style>
