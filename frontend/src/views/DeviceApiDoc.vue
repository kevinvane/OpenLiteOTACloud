<template>
  <div class="api-doc-container">
    <MarkdownContent />
  </div>
</template>

<script setup lang="ts">
import MarkdownContent from '../docs/device-api.md'
</script>

<style scoped>
.api-doc-container {
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  line-height: 1.8;
  font-size: 14px;
  color: #333;
}
.api-doc-container :deep(h1) {
  font-size: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
.api-doc-container :deep(h2) {
  font-size: 20px;
  margin: 24px 0 12px;
}
.api-doc-container :deep(h3) {
  font-size: 16px;
  margin: 16px 0 8px;
}
.api-doc-container :deep(p) {
  margin-bottom: 12px;
}
.api-doc-container :deep(code) {
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #409eff;
}
.api-doc-container :deep(pre) {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 16px;
}
.api-doc-container :deep(pre code) {
  background: none;
  padding: 0;
  color: #333;
}
.api-doc-container :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.api-doc-container :deep(th),
.api-doc-container :deep(td) {
  border: 1px solid #ebeef5;
  padding: 8px 12px;
  text-align: left;
}
.api-doc-container :deep(th) {
  background: #f5f7fa;
  font-weight: 600;
}
.api-doc-container :deep(blockquote) {
  border-left: 4px solid #409eff;
  margin: 16px 0;
  padding: 8px 16px;
  background: #ecf5ff;
  color: #666;
}
.api-doc-container :deep(hr) {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #eee;
}
</style>
