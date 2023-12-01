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
        <el-table
          :data="formValue.contractRecordsData"
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
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';

import { ApiContractDetail } from '@/http/contract/contractManagement';
import { formatAmount } from '@/utils/string';
import { formItems as formItemsData, signNames } from './data';

defineOptions({ name: 'ModalDetailContent' });

const pending = ref(false);
const contractNo = ref('');
const formValue = ref({});
const formItems = ref([...formItemsData]);

const init = async () => {
  try {
    pending.value = true;

    // 获取url参数
    const paramsStr = window.location.href.split('?')[1];
    const params = new URLSearchParams(paramsStr);
    contractNo.value = params.get('contractNo');

    if (!contractNo.value) return;

    const res = await ApiContractDetail({ contractNo: contractNo.value });
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

/** 预览文件 */
const handlePreview = (file) => {
  window.open(file.fileUrl);
};

onMounted(async () => {
  init();
});

onUnmounted(() => {
  formValue.value = {
    deptIds: [],
    personIds: [],
    contractRecordsData: [],
    contractPaymentRecordsData: [],
  };
});
</script>

<style lang="scss" scoped>
.ModalDetailContent {
  width: 1075px;
  padding-bottom: 8px;

  :deep(.el-form) {
    margin-left: 0 !important;
    margin-right: 0 !important;
    border-top: 1px solid $colorBorder;
    .el-form-item {
      margin: 0;
      border: 1px solid $colorBorder;
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
      border-right: 1px solid $colorBorder;
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
    border-collapse: collapse;
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
