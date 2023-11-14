<template>
  <el-drawer
    v-model="modal"
    title="详情"
    size="100%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div class="content scroll_thin overflow-auto full-y">
      <BaseForm
        v-loading="pending"
        ref="BaseFormRef"
        :formType="'detail'"
        v-model:formValue="formValue"
        :formItems="formItems"
      >
        <template #formAfter>
          <!-- 合同签订及履约记录 -->
          <div class="formAfterTitle">
            <span>合同签订及履约记录</span>
          </div>
          <el-table
            :data="formValue.contractRecordsData"
            style="width: 100%"
            class="mb-10"
            stripe
            border
            show-overflow-tooltip
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
                <div>
                  {{
                    signNames.find((s) => s.value === row.contractRecordName)
                      ?.label || '-'
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" minWidth="220">
            </el-table-column>
            <el-table-column
              prop="recordDate"
              label="时间"
              align="center"
              width="165"
            >
            </el-table-column>
            <el-table-column prop="remark" label="备注" minWidth="200">
              <template #default="{ row }">
                <div>{{ row.remark || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="annexesData" label="附件" minWidth="220">
              <template #default="{ row }">
                <div class="filesCol">
                  <el-tag
                    v-for="file in row.annexesData"
                    :key="file.key"
                    class="mx-1"
                    @click="() => handlePreview(file)"
                  >
                    {{ file.name }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 合同支付记录 -->
          <div class="formAfterTitle">
            <span>合同支付记录</span>
          </div>
          <el-table
            :data="formValue.contractPaymentRecordsData"
            style="width: 100%"
            class="mb-10"
            stripe
            border
            show-overflow-tooltip
          >
            <el-table-column
              fixed
              type="index"
              label="#"
              align="center"
              width="60"
            />
            <el-table-column
              prop="recordDate"
              label="时间"
              align="center"
              width="165"
            >
            </el-table-column>
            <el-table-column
              prop="amount"
              label="支付金额"
              align="center"
              width="160"
            >
              <template #default="{ row }">
                <div>{{ formatAmount(row.amount) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" minWidth="200">
              <template #default="{ row }">
                <div>{{ row.remark || '-' }}</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </BaseForm>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="onCloseFn">关闭</el-button>
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

defineOptions({ name: 'OrganModalDetail' });

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    default: 'detail',
  },
  row: {
    type: Object,
  },
});

const modal = ref(false);
const pending = ref(false);
const formValue = ref({});
const formItems = ref([...formItemsData]);

/** 责任部门选项 */
const responsibleDepts = ref([]);
/** 项目选项 */
const projects = ref([]);

const init = async () => {
  try {
    pending.value = true;
    const res = await ApiContractDetail({ contractNo: props.row.contractNo });
    formValue.value = {
      ...res,
      personIds: res.personNames.split(','),
    };
    formValue.value.contractRecordsData =
      formValue.value.contractRecords?.map((item) => {
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
    formValue.value.contractPaymentRecordsData =
      formValue.value.contractPaymentRecords?.map((item) => item) || [];
    // console.log('formValue.value :>> ', formValue.value);
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

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

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
    await base();
    if (props.modelValue) {
      init();
    } else {
      formValue.value = {
        deptIds: [],
        personIds: [],
        contractRecordsData: [],
        contractPaymentRecordsData: [],
      };
    }
  }
);

const onCloseFn = () => {
  emit('update:modelValue', false);
};

/** 预览文件 */
const handlePreview = (file) => {
  window.open(file.fileUrl);
};
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
