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
    <div v-loading="pending" class="content scroll_thin overflow-auto full-y">
      <BaseForm
        ref="BaseFormRef"
        v-model:formValue="formValue"
        :formItems="formItems"
        :rules="rules"
      >
        <template #formAfter>
          <div class="formAfterTitle">
            <span>合同签订及履约记录</span>
            <el-button type="primary" @click="handleAdd"> 新增一行 </el-button>
          </div>
          <el-table
            :data="formValue.tableData"
            style="width: 100%"
            stripe
            border
          >
            <el-table-column
              fixed
              type="index"
              prop="date"
              label="#"
              align="center"
              width="60"
            />
            <el-table-column
              prop="name"
              label="合同签订履行记录名称"
              width="260"
              align="center"
            >
              <template #default="{ row }">
                <el-select
                  v-model="row.name"
                  placeholder="请选择合同签订履行记录名称"
                  clearable
                >
                  <el-option
                    v-for="option in signNames"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容">
              <template #default="{ row }">
                <el-input
                  v-model="row.content"
                  placeholder="请输入内容"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label="时间"
              align="center"
              width="140"
            >
              <template #default="{ row }">
                <el-date-picker
                  v-model="row.date"
                  placeholder="请选择时间"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column prop="files" label="附件" width="160">
              <template #default="{ row }">
                <div v-for="file in row.files" :key="file.key">
                  {{ file.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="120"
            >
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="() => handleUpload(row)"
                >
                  上传
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="() => handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </BaseForm>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
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
import { ApiCreateMerchant, ApiEditMerchant } from '@/http/setting/organ.js';
import { modalTitleObj } from '@/data/common.js';
import { isMobile, isCreditCode } from '@/utils/validate.js';
import { formItems, signNames } from './data';

defineOptions({ name: 'OrganModalEdit' });

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

const modal = ref(false);
const modalTitle = computed(() => {
  return modalTitleObj[props.type];
});

const pending = ref(false);
const BaseFormRef = ref(null);
const formValue = ref({});

const creditCodeValidate = (rule, value, callback) => {
  if (isCreditCode(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的社会统一信用代码'));
  }
};
const mobileValidate = (rule, value, callback) => {
  if (isMobile(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的手机号'));
  }
};

const rules = ref({
  merchantName: [{ required: true, message: '请输入机构名称' }],
  merchantShortName: [{ required: true, message: '请输入机构简称' }],
  creditCode: [
    { required: true, message: '请输入社会统一信用代码' },
    { validator: creditCodeValidate },
  ],
  operationUserName: [{ required: true, message: '请输入联系人' }],
  operationUserMobile: [
    { required: true, message: '请输入联系电话' },
    { validator: mobileValidate },
  ],
});

/** 新增一行 */
const handleAdd = () => {
  formValue.value?.tableData?.push({
    name: '',
    content: '',
    date: '',
    files: [],
  });
};
/** 上传 */
const handleUpload = (row) => {};
/** 删除 */
const handleDelete = (row) => {};

const cancelClick = () => {
  emit('update:modelValue', false);
};

const confirmClick = async () => {
  console.log('formValue.value :>> ', formValue.value);
  return;
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    if (props.type === 'add') {
      await ApiCreateMerchant(formValue.value);
    } else if (props.type === 'edit') {
      await ApiEditMerchant(formValue.value);
    }
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

watch(
  () => props.modelValue,
  () => {
    modal.value = props.modelValue;
    if (props.modelValue) {
      console.log('props.row :>> ', props.row);
      formValue.value = props.row || { tableData: [] };
    } else {
      formValue.value = { tableData: [] };
    }
  }
);
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 8px;
}
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
</style>
