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
            <el-button type="primary" @click="handleAdd"> 新增记录 </el-button>
          </div>
          <el-table
            :data="formValue.contractRecords"
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
              prop="ContractRecordName"
              label="合同签订履行记录名称"
              width="260"
              align="center"
            >
              <template #default="{ row }">
                <el-select
                  v-model="row.ContractRecordName"
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
              prop="recordDate"
              label="时间"
              align="center"
              width="140"
            >
              <template #default="{ row }">
                <el-date-picker
                  v-model="row.recordDate"
                  placeholder="请选择时间"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column prop="annexes" label="附件" width="220">
              <template #default="{ row }">
                <div class="filesCol">
                  <el-tag
                    v-for="file in row.annexes"
                    :key="file.key"
                    class="mx-1"
                    closable
                    @click="() => handlePreview(file)"
                    @close="() => handleClose(row, file)"
                  >
                    {{ file.name }}
                  </el-tag>
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
                    :on-error="
                      (error, file, fileList) =>
                        handleError(row, error, file, fileList)
                    "
                    :on-exceed="
                      (file, fileList) => handleExceed(row, file, fileList)
                    "
                    :on-remove="
                      (file, fileList) => handleRemove(row, file, fileList)
                    "
                  >
                    <el-button link type="primary" size="small">
                      上传
                    </el-button>
                  </el-upload>
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
        <el-button @click="cancelClick">关闭</el-button>
        <el-button :disabled="pending" type="primary" @click="confirmClick">
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';
import { uploadAction, uploadHeaders } from '@/config/base';
import { ApiListUser } from '@/http/setting/user.js';
import { ApiDeptList } from '@/http/setting/department.js';
import {
  ApiCreateContract,
  ApiEditContract,
  ApiContractDetail,
} from '@/http/contract/contractManagement';
import { modalTitleObj } from '@/data/common.js';
import { getAuthUser } from '@/utils/auth';
import { parseToDate } from '@/utils/string';
import { formItems as formItemsData, signNames } from './data';

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

const user = getAuthUser();

const modal = ref(false);
const modalTitle = computed(() => {
  return modalTitleObj[props.type];
});

const pending = ref(false);
/** 责任部门选项 */
const responsibleDepts = ref([]);
const BaseFormRef = ref(null);
const formValue = ref({});
const formItems = ref([...formItemsData]);

const creditCodeValidate = (rule, value, callback) => {
  if (isCreditCode(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的社会统一信用代码'));
  }
};

const rules = ref({
  contractName: [{ required: true, message: '请输入合同名称' }],
  deptIds: [{ required: true, message: '请选择合同所属部门' }],
  signDate: [{ required: true, message: '请选择签订时间' }],
  partyB: [{ required: true, message: '请输入对方单位' }],
  contractTerms: [{ required: true, message: '请输入合同主要条款' }],
  contractAmt: [{ required: true, message: '请输入合同金额' }],
  contractEndDate: [{ required: true, message: '请选择合同期限' }],
  responsibleDeptId: [{ required: true, message: '请选择合同责任部门' }],
  personIds: [{ required: true, message: '请选择责任人' }],
  remark: [{ required: true, message: '请输入备注' }],
});

/** 新增记录 */
const handleAdd = () => {
  formValue.value?.contractRecords?.push({
    key: Date.now(),
    ContractRecordName: '',
    content: '',
    recordDate: '',
    annexes: [],
  });
};
/** 上传成功 */
const handleSuccess = (row, response, file, fileList) => {
  try {
    if (!response.success) throw '上传失败';
    row.annexes.push({
      key: response.data?.[0]?.fileName || '',
      name: file.name,
      fileUrl: response.data?.[0]?.fileUrl || '',
    });
  } catch (error) {
    ElMessage.error(`${error}`);
  }
};
const handleError = (row, error, file, fileList) => {};
const handleExceed = (row, file, fileList) => {};
const handleRemove = (row, file, fileList) => {};
/** 删除记录 */
const handleDelete = (row) => {
  const index = formValue.value?.contractRecords.findIndex(
    (ft) => ft.key === row.key
  );
  formValue.value?.contractRecords.splice(index, 1);
};

/** 预览文件 */
const handlePreview = (file) => {
  window.open(file.fileUrl);
};
/** 删除文件 */
const handleClose = (row, file) => {
  const index = row.annexes.findIndex((rf) => rf.key === file.key);
  row.annexes.splice(index, 1);
};

const cancelClick = () => {
  emit('update:modelValue', false);
};

// 保存处理表单数据
const handleFormValue = () => {
  formValue.value.signDate = parseToDate(formValue.value.signDate);
  formValue.value.contractEndDate = parseToDate(
    formValue.value.contractEndDate
  );
  formValue.value.responsibleDeptName =
    responsibleDepts.value.find(
      (r) => r.value === formValue.value.responsibleDeptId
    )?.label || '';
  formValue.value.personNames = formValue.value.personIds.join(',');
  formValue.value.contractRecords = formValue.value.contractRecords.map(
    (item) => {
      return {
        ContractRecordName: item.ContractRecordName,
        content: item.content,
        recordDate: parseToDate(item.recordDate),
        annexes: item.annexes.map((annex) => annex.key).join(','),
      };
    }
  );
};

const confirmClick = async () => {
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    console.log('formValue.value :>> ', formValue.value);
    handleFormValue();
    if (props.type === 'add') {
      await ApiCreateContract(formValue.value);
    } else if (props.type === 'edit') {
      await ApiEditContract(formValue.value);
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
      formValue.value = props.row || { personIds: [], contractRecords: [] };
    } else {
      formValue.value = { personIds: [], contractRecords: [] };
    }
  }
);

// 监听合同责任部门
watch(
  () => formValue.value.responsibleDeptId,
  async (value) => {
    // 责任人
    const item_personIds = formItems.value.find(
      (item) => item.name === 'personIds'
    );
    if (!item_personIds) return;

    if (!value) {
      item_personIds.options = [];
    } else {
      const res = await ApiListUser({
        orgId: user.orgId,
        deptId: value,
      });
      if (item_personIds) {
        item_personIds.options =
          res?.map((item) => ({
            label: item.userName,
            value: item.userId,
          })) || [];
      }
    }

    formValue.value = {
      ...formValue.value,
      personIds: [],
    };
  }
);

onMounted(async () => {
  const Item_responsibleDeptId = formItems.value.find(
    (item) => item.name === 'responsibleDeptId'
  );
  responsibleDepts.value = await ApiDeptList({
    orgId: user.orgId,
  });
  Item_responsibleDeptId.options = responsibleDepts.value;
});
</script>

<style lang="scss" scoped>
.content {
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
  }
}
</style>
