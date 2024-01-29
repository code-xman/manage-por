<template>
  <div v-loading="loading" class="merchant full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :defaultParams="defaultParams"
      :columns="columns"
      :list="ApiSysFilePage"
      :options-size="160"
    >
      <template #btn>
        <el-upload
          class="upload mb-10"
          :disabled="loading"
          :action="uploadAction"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="
            (response, file, fileList) =>
              uploadFn(row, response, file, fileList)
          "
        >
          <el-button
            v-allow="'3e77d59b5f5144f784f699d66ac24314'"
            type="primary"
          >
            上传
          </el-button>
        </el-upload>
      </template>
      <template #options="{ row }">
        <el-button
          v-allow="'9a7c8726605845e38e90c9810663a004'"
          type="primary"
          link
          @click="() => previewFn(row)"
        >
          查看
        </el-button>
        <el-button
          v-allow="'e9fbc8cb6446436189eb49c65a5f25f5'"
          type="danger"
          link
          @click="() => deleteFn(row)"
        >
          删除
        </el-button>
        <el-button
          v-allow="'f31b575828344112b58519993cb95040'"
          type="success"
          link
          @click="() => downloadFn(row)"
        >
          下载
        </el-button>
      </template>
    </BasePage>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import FileSaver from 'file-saver';

import BasePage from '@/components/BasePage/index';
import { uploadAction, uploadHeaders } from '@/config/base';
import {
  ApiSysFilePage,
  ApiSysFileAdd,
  ApiSysFileDel,
} from '@/http/file/index.js';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'ShowBasePage',
});

const BasePageRef = ref(null);
const searchFormValue = ref({});
const loading = ref(false);
const defaultParams = ref({
  fileType: '2',
});

const uploadFn = async (row, response, file, fileList) => {
  try {
    loading.value = true;
    if (!response.success) throw '上传失败';
    const data = {
      fileKey: response.data?.[0]?.fileName,
      fileName: file.name,
      fileUrl: response.data?.[0]?.fileUrl,
      fileType: '2', // 1-政策文件;2-表格文件
    };
    await ApiSysFileAdd(data);
    ElMessage.success('上传成功');
    BasePageRef.value?.refresh();
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    loading.value = false;
  }
};

const previewFn = (row) => {
  if (!row.fileUrl) {
    ElMessage.warning('无法查看此文件');
    return;
  }
  window.open(row.fileUrl);
};

const deleteFn = async (row) => {
  try {
    await ElMessageBox.confirm('确定是否删除此文件？', '操作提示', {
      type: 'warning',
    });
    loading.value = true;
    await ApiSysFileDel({ fileKey: row.fileKey });
    ElMessage.success('删除成功');
    BasePageRef.value?.refresh();
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    loading.value = false;
  }
};

//TODO: 未成功
const downloadFn = async (row) => {
  try {
    FileSaver.saveAs(row.fileUrl, `${row.fileName}`);
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
  }
};
</script>

<style lang="scss" scoped></style>
