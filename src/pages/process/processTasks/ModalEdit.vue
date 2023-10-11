<template>
  <el-drawer
    v-model="modal"
    :title="modalTitle"
    size="90%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div
      v-loading="pending"
      class="process-info scroll_thin overflow-auto full-y"
    >
      <BaseForm
        ref="BaseFormRef"
        :formType="props.type"
        v-model:formValue="formValue"
        :formItems="formItems"
        :rules="rules"
      >
        <template #formAfter>
          <div class="formAfterTitle">
            <span>文件列表</span>
            <el-button v-if="!isDetail" type="primary" @click="handleAdd">
              新增
            </el-button>
          </div>
          <el-table
            :data="formValue.actFiles"
            style="width: 100%"
            stripe
            border
          >
            <el-table-column
              fixed
              type="index"
              label="#"
              align="center"
              width="60"
            />
            <el-table-column
              prop="fileType"
              label="文件类型"
              width="200"
              align="center"
            >
              <template #default="{ row }">
                <template v-if="isDetail">
                  <div>
                    {{
                      fileTypes.find((s) => s.value === row.fileType)?.label ||
                      '-'
                    }}
                  </div>
                </template>
                <el-select
                  v-else
                  v-model="row.fileType"
                  placeholder="请选择文件类型"
                  clearable
                >
                  <el-option
                    v-for="option in fileTypes"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="fileName" label="附件" min-width="220">
              <template #default="{ row }">
                <div class="filesCol">
                  {{ row.fileName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!isDetail"
              fixed="right"
              label="操作"
              align="center"
              width="160"
            >
              <template #default="{ row }">
                <div class="operate">
                  <el-upload
                    class="upload"
                    :action="uploadAction"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="
                      (response, file, fileList) =>
                        handleSuccess(row, response, file, fileList)
                    "
                  >
                    <el-button link type="primary" size="small">
                      上传
                    </el-button>
                  </el-upload>
                  <el-button
                    type="primary"
                    link
                    size="small"
                    @click="() => handlePreview(row)"
                  >
                    预览
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="() => handleDelete(row)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </BaseForm>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="onCloseFn">关闭</el-button>
        <el-button :disabled="pending" type="primary" @click="confirmClick">
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';

import { uploadAction, uploadHeaders } from '@/config/base';
import { getAuthUser } from '@/utils/auth';
import { modalTitleObj } from '@/data/common.js';

import {
  ApiComplete,
  ApiListActFile,
} from '@/http/process/processManagement.js';
import { formItems as formItemsData, fileTypes } from './data';

defineOptions({ name: 'ProcessTasksEdit' });

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    default: 'edit',
  },
  row: {
    type: Object,
  },
});

const user = getAuthUser();

/** 是否是详情 */
const isDetail = computed(() => props.type === 'detail');

const modal = ref(false);
const modalTitle = computed(() => {
  return modalTitleObj[props.type];
});

const pending = ref(false);
// 表单
const BaseFormRef = ref(null);
const formValue = ref({ actFiles: [] });
const formItems = ref([...formItemsData]);
// 验证规则
const rules = ref({
  completeTime: [{ required: true, message: '请选择完成时间' }],
  requirement: [{ required: true, message: '请选择是否达到要求' }],
  completeDesc: [{ required: true, message: '请输入完成情况' }],
});

/** 新增记录 */
const handleAdd = () => {
  formValue.value?.actFiles?.push({
    key: Date.now(),
    fileType: '',
    fileKey: '',
    fileName: '',
    fileUrl: '',
  });
};

/** 上传成功 */
const handleSuccess = (row, response, file, fileList) => {
  try {
    if (!response.success) throw '上传失败';

    row.fileKey = response.data?.[0]?.fileName;
    row.fileName = file.name;
    row.fileUrl = response.data?.[0]?.fileUrl;
  } catch (error) {
    ElMessage.error(`${error}`);
  }
};

/** 预览文件 */
const handlePreview = (row) => {
  window.open(row.fileUrl);
};

const actFilesObj = {
  fileType: '文件类型',
  fileKey: '附件',
};

// 文件列表验证
const actFilesValiateFn = () => {
  const _actFiles = formValue.value.actFiles;
  if (!_actFiles || !_actFiles?.length)  throw '请添加文件';

  const keys = Object.keys(actFilesObj);
  let nullIndex = -1;
  let nullKey = undefined;
  const hasNullItem = _actFiles.find((item, index) => {
    const key = keys.find((key) => {
      if (key === 'annexes') return !item[key]?.length;
      return !item[key] || !item[key]?.length;
    });
    console.log('object :>> ', { index, key });
    nullIndex = index;
    nullKey = key;
    return !!key;
  });

  if (!!hasNullItem) {
    throw `请完善文件列表第${nullIndex + 1}个文件的${actFilesObj[nullKey]}`;
  }
}

// 保存
const confirmClick = async () => {
  try {
    pending.value = true;
    await actFilesValiateFn();
    await BaseFormRef.value?.validate();

    await ApiComplete({
      actDefId: props.row.actDefId,
      projectId: props.row.projectId,
      ...formValue.value,
    });

    ElMessage.success('保存成功');
    emit('update:modelValue', false);
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

const onCloseFn = () => {
  emit('update:modelValue', false);
};

const init = async () => {
  try {
    pending.value = true;
    // 详情 整合数据
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  () => {
    modal.value = props.modelValue;
    if (['detail'].includes(props.type) && props.modelValue) {
      init();
    } else {
      formValue.value = { actFiles: [] };
    }
  }
);
</script>

<style lang="scss" scoped>
.process-info {
  padding-bottom: 8px;

  .formAfterTitle {
    border-bottom: 1px solid $colorBorder;
    width: 100%;
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: bold;

    display: flex;
    justify-content: space-between;

    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 9;
    background: #fff;
    span {
      height: 32px;
      line-height: 32px;
    }
  }

  :deep(.el-select) {
    width: 100%;
  }

  .filesCol {
    .el-tag {
      max-width: 100%;
      overflow: hidden;
      cursor: pointer;
      :deep(.el-tag__content) {
        max-width: calc(100% - 20px);
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .operate {
    display: flex;
    & > * {
      padding: 4px 8px;
    }
    .upload {
      display: flex;
    }
    .el-button + .el-button {
      margin: 0;
    }
  }
}
.actDefDescCell {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
