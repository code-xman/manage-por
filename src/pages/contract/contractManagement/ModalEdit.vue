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
    <div class="content scroll_thin overflow-auto full-y">
      <BaseForm
        v-loading="pending"
        ref="BaseFormRef"
        :formType="props.type === 'editRecord' ? 'detail' : props.type"
        v-model:formValue="formValue"
        :formItems="formItems"
        :rules="rules"
      >
        <template #formAfter v-if="props.type !== 'add'">
          <!-- 合同签订及履约记录 -->
          <div class="formAfterTitle">
            <span>合同签订及履约记录</span>
            <el-button v-if="isEditRecord" type="primary" @click="handleAdd">
              新增记录
            </el-button>
          </div>
          <el-table
            :data="contractRecords"
            style="width: 100%"
            class="mb-10"
            stripe
            border
            :show-overflow-tooltip="!isEditRecord"
          >
            <el-table-column
              fixed
              type="index"
              label="#"
              align="center"
              width="60"
            />
            <el-table-column
              prop="contractRecordName"
              label="合同签订履行记录名称"
              width="260"
              align="center"
            >
              <template #default="{ row }">
                <template v-if="!isEditRecord">
                  <div>
                    {{
                      signNames.find((s) => s.value === row.contractRecordName)
                        ?.label || '-'
                    }}
                  </div>
                </template>
                <el-select
                  v-else
                  v-model="row.contractRecordName"
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
            <el-table-column prop="content" label="内容" minWidth="220">
              <template #default="{ row }">
                <template v-if="!isEditRecord">
                  <div>{{ row.content }}</div>
                </template>
                <el-input
                  v-else
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
              width="165"
            >
              <template #default="{ row }">
                <template v-if="!isEditRecord">
                  <div>{{ row.recordDate }}</div>
                </template>
                <el-date-picker
                  v-else
                  v-model="row.recordDate"
                  placeholder="请选择时间"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" minWidth="200">
              <template #default="{ row }">
                <template v-if="!isEditRecord">
                  <div>{{ row.remark }}</div>
                </template>
                <el-input
                  v-else
                  v-model="row.remark"
                  placeholder="请输入备注"
                  clearable
                  maxlength="100"
                />
              </template>
            </el-table-column>
            <el-table-column prop="annexesData" label="附件" minWidth="220">
              <template #default="{ row }">
                <div class="filesCol" v-loading="uploading">
                  <el-tag
                    v-for="file in row.annexesData"
                    :key="file.key"
                    class="mx-1"
                    :closable="isEditRecord"
                    @click="() => handlePreview(file)"
                    @close="() => handleClose(row, file)"
                  >
                    {{ file.name }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isEditRecord"
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
                    <el-button
                      :disabled="uploading"
                      link
                      type="primary"
                      size="small"
                    >
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
          <!-- 合同支付记录 -->
          <div class="formAfterTitle">
            <span>合同支付记录</span>
            <el-button
              v-if="isEditRecord"
              type="primary"
              @click="handlePaymentAdd"
            >
              新增记录
            </el-button>
          </div>
          <el-table
            :data="contractPayRecords"
            style="width: 100%"
            class="mb-10"
            stripe
            border
            :show-overflow-tooltip="!isEditRecord"
          >
            <el-table-column
              fixed
              type="index"
              label="#"
              align="center"
              width="60"
            />
            <el-table-column
              prop="payTime"
              label="时间"
              align="center"
              width="165"
            >
              <template #default="{ row }">
                <template v-if="!isEditRecord">
                  <div>{{ row.payTime }}</div>
                </template>
                <el-date-picker
                  v-else
                  v-model="row.payTime"
                  placeholder="请选择时间"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="payAmt"
              label="支付金额"
              align="center"
              width="160"
            >
              <template #default="{ row }">
                <template v-if="!isEditRecord">
                  <div>{{ formatAmount(row.payAmt) }}</div>
                </template>
                <el-input-number
                  v-else
                  v-model="row.payAmt"
                  placeholder="请输入支付金额"
                  :min="0"
                  :max="1e9"
                  :step="1"
                  :precision="2"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" minWidth="200">
              <template #default="{ row }">
                <template v-if="!isEditRecord">
                  <div>{{ row.remark }}</div>
                </template>
                <el-input
                  v-else
                  v-model="row.remark"
                  placeholder="请输入备注"
                  clearable
                  maxlength="100"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="isEditRecord"
              fixed="right"
              label="操作"
              align="center"
              width="70"
            >
              <template #default="{ row }">
                <div class="operate">
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="() => handlePaymentDelete(row)"
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
import { ApiListProject } from '@/http/process/processManagement.js';
import {
  ApiCreateContract,
  ApiEditContract,
  ApiContractDetail,
  ApiListContractSignRecord,
  ApiCreateContractRecord,
  ApiListContractPayRecord,
  ApiCreateContractPayRecord,
} from '@/http/contract/contractManagement';
import { modalTitleObj } from '@/data/common.js';
import { getAuthUser } from '@/utils/auth';
import { parseToDate, formatAmount } from '@/utils/string';
import { useReasonConfirm } from '@/utils/hooks.js';
import {
  formItems as formItemsData,
  signNames,
  contractRecordsObj,
  contractPaymentRecordsObj,
} from './data';

defineOptions({ name: 'OrganModalEdit' });

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: Boolean,
  // add-新增 edit-完善合同 editRecord-编辑记录 detail-详情
  type: {
    type: String,
    default: 'edit',
  },
  row: {
    type: Object,
  },
});

/** 是否是 详情 */
const isDetail = computed(() => props.type === 'detail');
/** 是否是 修改记录 */
const isEditRecord = computed(() => props.type === 'editRecord');

const user = getAuthUser();

const modal = ref(false);
const modalTitle = computed(() => {
  return modalTitleObj[props.type];
});

const pending = ref(false);
const uploading = ref(false);
/** 责任部门选项 */
const responsibleDepts = ref([]);
/** 项目选项 */
const projects = ref([]);
const BaseFormRef = ref(null);
const formValue = ref({});
const formItems = ref([...formItemsData]);
// 合同签订及履约记录 数据
const contractRecords = ref([]);
const hasContractRecords = ref(false);
// 合同支付记录 数据
const contractPayRecords = ref([]);
const hasContractPayRecords = ref(false);

// 合同签订时间不能大于合同期限
const contractDateValidate = (rule, value, callback) => {
  const signDateVal = formValue.value.signDate?.valueOf();
  const contractEndDateVal = formValue.value.contractEndDate?.valueOf();
  if (signDateVal >= contractEndDateVal) {
    callback(new Error('签订时间应小于合同期限'));
  }
  callback();
};

const rules = ref({
  contractName: [{ required: true, message: '请输入合同名称' }],
  deptIds: [{ required: true, message: '请选择合同所属部门' }],
  signDate: [
    { required: true, message: '请选择签订时间' },
    { validator: contractDateValidate },
  ],
  projectId: [{ required: true, message: '请选择项目名称' }],
  partyB: [{ required: true, message: '请输入对方单位' }],
  contractTerms: [{ required: true, message: '请输入合同主要条款' }],
  contractAmt: [{ required: true, message: '请输入合同金额' }],
  contractEndDate: [
    { required: true, message: '请选择合同期限' },
    { validator: contractDateValidate },
  ],
  responsibleDeptId: [{ required: true, message: '请选择合同责任部门' }],
  personIds: [{ required: true, message: '请选择责任人' }],
  // remark: [{ required: true, message: '请输入备注' }],
});

/** 新增记录 合同签订及履约记录 */
const handleAdd = () => {
  contractRecords.value?.push({
    key: Date.now(),
    contractRecordName: '',
    content: '',
    recordDate: '',
    remark: '',
    annexesData: [],
  });
};
/** 上传成功 */
const handleSuccess = (row, response, file, fileList) => {
  try {
    uploading.value = true;
    if (!response.success) throw '上传失败';
    row.annexesData.push({
      key: response.data?.[0]?.fileName || '',
      // name: file.name,
      name: response.data?.[0]?.fileName,
      fileUrl: response.data?.[0]?.fileUrl || '',
    });
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    uploading.value = false;
  }
};
const handleError = (row, error, file, fileList) => {};
const handleExceed = (row, file, fileList) => {};
const handleRemove = (row, file, fileList) => {};
/** 删除记录 */
const handleDelete = (row) => {
  const index = contractRecords.value?.findIndex((ft) => ft.key === row.key);
  contractRecords.value?.splice(index, 1);
};

/** 预览文件 */
const handlePreview = (file) => {
  window.open(file.fileUrl);
};
/** 删除文件 */
const handleClose = (row, file) => {
  const index = row.annexesData.findIndex((rf) => rf.key === file.key);
  row.annexesData.splice(index, 1);
};

/** 合同支付记录 新增 */
const handlePaymentAdd = () => {
  contractPayRecords.value?.push({
    key: Date.now(),
    payTime: '',
    payAmt: null,
    remark: '',
  });
};
/** 合同支付记录 删除 */
const handlePaymentDelete = (row) => {
  const index = contractPayRecords.value?.findIndex((ft) => ft.key === row.key);
  contractPayRecords.value?.splice(index, 1);
};

const cancelClick = () => {
  emit('update:modelValue', false);
};

// 保存处理表单数据
const handleFormValue = () => {
  // 日期格式化
  formValue.value.signDate = parseToDate(formValue.value.signDate);
  formValue.value.contractEndDate = parseToDate(
    formValue.value.contractEndDate
  );
  // 项目名称
  formValue.value.projectName =
    projects.value.find((p) => p.value === formValue.value.projectId)?.label ||
    '';
  // 责任部门名称
  formValue.value.responsibleDeptName =
    responsibleDepts.value.find(
      (r) => r.value === formValue.value.responsibleDeptId
    )?.label || '';
  // 负责人名称
  formValue.value.personNames = formValue.value.personIds.join(',');
};

// 保存处理记录数据
const handleRecordsValue = () => {
  // 合同签订及履约记录
  contractRecords.value = contractRecords.value.map((item) => {
    return {
      actId: item.actId, // 节点id
      contractRecordName: item.contractRecordName,
      content: item.content,
      recordDate: parseToDate(item.recordDate),
      remark: item.remark,
      annexesData: item.annexesData,
      annexes: item.annexesData.map((annex) => annex.key).join(','),
    };
  });

  // 合同支付记录
  contractPayRecords.value = contractPayRecords.value?.map((item, index) => {
    return {
      indexNo: index,
      payTime: parseToDate(item.payTime),
      payAmt: item.payAmt,
      remark: item.remark,
    };
  });
};

// 合同签订及履约记录验证
const contractRecordsValidateFn = () => {
  if (hasContractRecords.value && !contractRecords.value?.length) {
    throw '请添加合同签订及履约记录';
  }
  if (!contractRecords.value?.length) return;
  const keys = Object.keys(contractRecordsObj);
  let nullIndex = -1;
  let nullKey = undefined;
  const hasNullItem = contractRecords.value?.find((item, index) => {
    const key = keys.find((key) => {
      if (key === 'remark') return false; // 备注不验证
      if (key === 'annexesData') return !item[key]?.length;
      return !item[key];
    });
    // console.log('object :>> ', { index, key });
    nullIndex = index;
    nullKey = key;
    return !!key;
  });

  if (!!hasNullItem) {
    throw `请完善第${nullIndex + 1}条合同签订及履约记录的${
      contractRecordsObj[nullKey]
    }`;
  }
};

// 合同支付记录验证
const contractPaymentRecordsValidateFn = () => {
  if (hasContractPayRecords.value && !contractPayRecords.value?.length) {
    throw '请添加合同支付记录';
  }
  if (!contractPayRecords.value?.length) return;
  const keys = Object.keys(contractPaymentRecordsObj);
  let nullIndex = -1;
  let nullKey = undefined;
  const hasNullItem = contractPayRecords.value.find((item, index) => {
    const key = keys.find((key) => {
      if (key === 'remark') return false; // 备注不验证
      return !item[key];
    });
    // console.log('object :>> ', { index, key });
    nullIndex = index;
    nullKey = key;
    return !!key;
  });

  if (!!hasNullItem) {
    throw `请完善第${nullIndex + 1}条合同支付记录的${
      contractPaymentRecordsObj[nullKey]
    }`;
  }
};

// 保存
const confirmClick = async () => {
  try {
    pending.value = true;
    if (['edit'].includes(props.type)) {
      await BaseFormRef.value?.validate();
      handleFormValue();
    }
    if (['editRecord'].includes(props.type)) {
      contractRecordsValidateFn();
      contractPaymentRecordsValidateFn();
      handleRecordsValue();
    }
    if (props.type === 'add') {
      await ApiCreateContract(formValue.value);
    } else if (['edit'].includes(props.type)) {
      const reasonObj = await useReasonConfirm(); // 二次确认
      await ApiEditContract({
        ...formValue.value,
        modifyContent: reasonObj.value,
      });
    } else if (['editRecord'].includes(props.type)) {
      // 已经有数据 || 当前有数据
      if (hasContractRecords.value || contractRecords.value?.length) {
        // 保存-合同履约记录
        await ApiCreateContractRecord({
          contractNo: props.row.contractNo,
          contractRecords: contractRecords.value,
        });
      }

      // 已经有数据 || 当前有数据
      if (hasContractPayRecords.value || contractPayRecords.value?.length) {
        // 保存-合同支付记录
        await ApiCreateContractPayRecord({
          contractNo: props.row.contractNo,
          contractPayRecords: contractPayRecords.value,
        });
      }
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

const init = async () => {
  try {
    pending.value = true;
    const res = await ApiContractDetail({ contractNo: props.row.contractNo });
    formValue.value = {
      ...res,
      personIds: res.personNames.split(','),
    };
    // 合同履约记录
    const signRes = await ApiListContractSignRecord({
      contractNo: props.row.contractNo,
    });
    if (signRes?.length) {
      hasContractRecords.value = true;
    }
    contractRecords.value =
      signRes?.map((item) => {
        return {
          ...item,
          signDate: new Date(formValue.value.signDate),
          contractEndDate: new Date(formValue.value.contractEndDate),
          annexesData:
            item.annexes?.map((annex) => ({
              key: annex.value,
              name: annex.value,
              fileUrl: annex.label,
            })) || [],
        };
      }) || [];
    // 合同支付记录
    const payRes = await ApiListContractPayRecord({
      contractNo: props.row.contractNo,
    });
    if (payRes?.length) {
      hasContractPayRecords.value = true;
    }
    contractPayRecords.value = payRes?.map((item) => item) || [];
    // console.log('formValue.value :>> ', formValue.value);
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
    await base();
    if (
      ['edit', 'editRecord', 'detail'].includes(props.type) &&
      props.modelValue
    ) {
      init();
    } else {
      formValue.value = {
        deptIds: [],
        personIds: [],
      };
      contractPayRecords.value = [];
      hasContractRecords.value = false;
      contractRecords.value = [];
      hasContractPayRecords.value = false;
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
    // 无选项则不清空数据，处理初始化赋值不清空
    if (!!item_personIds.options?.length) {
      formValue.value = {
        ...formValue.value,
        personIds: [],
      };
    }

    // 处理新的负责人的选项
    if (!value) {
      item_personIds.options = [];
    } else {
      const res = await ApiListUser({
        orgId: props.row?.merchantId || user.orgId,
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
  }
);

const base = async () => {
  // 合同所属部门
  const Item_deptIds = formItems.value.find((item) => item.name === 'deptIds');
  // 合同责任部门
  const Item_responsibleDeptId = formItems.value.find(
    (item) => item.name === 'responsibleDeptId'
  );
  responsibleDepts.value = await ApiDeptList({
    orgId: props.row?.merchantId || user.orgId,
  });

  Item_deptIds.options = responsibleDepts.value;
  Item_responsibleDeptId.options = responsibleDepts.value;

  // 项目名称
  const Item_projectId = formItems.value.find(
    (item) => item.name === 'projectId'
  );
  projects.value = await ApiListProject();
  if (Item_projectId) {
    Item_projectId.options = projects.value;
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 8px;

  .formAfterTitle {
    // border-bottom: 1px solid $colorBorder;
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

  :deep(.el-input-number) {
    width: 100%;
    .el-input {
      .el-input__wrapper {
        padding: 1px 11px;
        .el-input__inner {
          text-align: left;
        }
      }
    }
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
  }
}
</style>
