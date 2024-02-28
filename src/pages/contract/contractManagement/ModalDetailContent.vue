<!-- 详情内容组件  -->
<template>
  <div class="ModalDetailContent scroll_thin overflow-auto full-y">
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
        <el-table :data="contractRecords" style="width: 100%" stripe border>
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
            width="140"
          >
          </el-table-column>
          <el-table-column prop="remark" label="备注" minWidth="180">
            <template #default="{ row }">
              <div>{{ row.remark || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="annexesData" label="附件" minWidth="180">
            <template #default="{ row }">
              <div v-if="type === 'detail'" class="filesCol">
                <el-tag
                  v-for="file in row.annexesData"
                  :key="file.key"
                  :title="file.name"
                  class="mx-1"
                  @click="() => handlePreview(file)"
                >
                  {{ file.name }}
                </el-tag>
              </div>
              <div v-else-if="type === 'priview'" class="filesCol">
                <div v-for="file in row.annexesData">
                  {{ file.name }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 合同支付记录 -->
        <div class="formAfterTitle">
          <span>合同支付记录</span>
        </div>
        <el-table :data="contractPayRecords" style="width: 100%" stripe border>
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
          </el-table-column>
          <el-table-column
            prop="payAmt"
            label="支付金额"
            align="center"
            width="160"
          >
            <template #default="{ row }">
              <div>{{ formatAmount(row.payAmt) }}</div>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';

import { ApiListUser } from '@/http/setting/user.js';
import { ApiDeptList } from '@/http/setting/department.js';
import { ApiListProject } from '@/http/process/processManagement.js';
import {
  ApiContractDetail,
  ApiListContractSignRecord,
  ApiListContractPayRecord,
} from '@/http/contract/contractManagement';
import { formatAmount } from '@/utils/string';
import { formItems as formItemsData, signNames } from './data';

defineOptions({ name: 'ModalDetailContent' });

const pending = ref(false);
const contractNo = ref('');
const formValue = ref({});
const formItems = ref([...formItemsData]);
const orgId = ref('');
const type = ref(''); // detail-详情 priview-预览

/** 责任部门选项 */
const responsibleDepts = ref([]);
// 合同签订及履约记录 数据
const contractRecords = ref([]);
// 合同支付记录 数据
const contractPayRecords = ref([]);

const base = async () => {
  // 获取url参数
  const paramsStr = window.location.href.split('?')[1];
  const params = new URLSearchParams(paramsStr);
  contractNo.value = params.get('contractNo');
  orgId.value = params.get('oId');
  type.value = params.get('type');

  // 合同所属部门
  const Item_deptIdsData = formItems.value.find(
    (item) => item.name === 'deptIdsData'
  );
  // 合同责任部门
  const Item_responsibleDeptId = formItems.value.find(
    (item) => item.name === 'responsibleDeptId'
  );
  responsibleDepts.value = await ApiDeptList({
    orgId: orgId.value,
  });

  Item_deptIdsData.options = responsibleDepts.value;
  Item_responsibleDeptId.options = responsibleDepts.value;

  // 项目名称
  const Item_projectId = formItems.value.find(
    (item) => item.name === 'projectId'
  );
  if (Item_projectId) {
    Item_projectId.options = await ApiListProject();
  }
};

const init = async () => {
  try {
    pending.value = true;

    if (!contractNo.value) return;

    const res = await ApiContractDetail({ contractNo: contractNo.value });
    formValue.value = {
      ...res,
      deptIdsData: res.deptIds?.split(',') || [],
      personIds: res.personNames?.split(',') || [],
    };
    // 合同履约记录
    const signRes = await ApiListContractSignRecord({
      contractNo: contractNo.value,
    });

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
      contractNo: contractNo.value,
    });

    contractPayRecords.value = payRes?.map((item) => item) || [];
    // console.log('formValue.value :>> ', formValue.value);
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

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
        orgId: orgId.value,
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

/** 预览文件 */
const handlePreview = (file) => {
  window.open(file.fileUrl);
};

onMounted(async () => {
  await base();
  await init();
});

onUnmounted(() => {
  formValue.value = {
    deptIdsData: [],
    personIds: [],
  };
  contractRecords.value = [];
  contractPayRecords.value = [];
});
</script>

<style lang="scss" scoped>
$colorBorder: #666;

.ModalDetailContent {
  width: 1075px;
  padding-bottom: 8px;

  :deep(.el-form) {
    margin-left: 0 !important;
    margin-right: 0 !important;
    border-top: 1px solid $colorBorder;
    border-right: 1px solid $colorBorder;
    .el-form-item {
      margin: 0;
      border: 1px solid $colorBorder;
      border-right: 0;
      border-top: 0;
      height: 40px;
      line-height: 40px;
      .el-form-item__label {
        border-right: 1px solid $colorBorder;
        height: 40px;
        line-height: 40px;
        justify-content: center;
        font-weight: bold;
      }
      .el-form-item__content {
        padding: 0 10px;
      }
    }
    .formAfterTitle {
      border-left: 1px solid $colorBorder;
    }
  }

  .formAfterTitle {
    // border-bottom: 1px solid $colorBorder;
    width: 100%;
    // padding-bottom: 10px;
    font-size: 14px;
    font-weight: bold;

    display: flex;
    justify-content: center;

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
  .el-table {
    border: 1px solid $colorBorder;
    border-right: 0;
    border-collapse: collapse;
    :deep(th),
    :deep(td) {
      color: #333;
      border-color: $colorBorder;
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

// 打印背景图形
@media print {
  .ModalDetailContent {
    -webkit-print-color-adjust: exact;
    -moz-print-color-adjust: exact;
    -ms-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
