<!-- 项目详情内容组件  -->
<template>
  <div class="ModalDetailContent scroll_thin overflow-auto full-y">
    <BaseForm
      ref="BaseFormRef"
      :formType="'detail'"
      v-model:formValue="formValue"
      :formItems="formItems"
    >
      <template #formAfter>
        <div class="formAfterTitle">
          <span>步骤节点配置列表</span>
        </div>
        <el-table
          :data="processConfigs"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column
            fixed
            type="index"
            label="#"
            align="center"
            width="50"
          />
          <el-table-column
            prop="actDefName"
            label="步骤节点名称"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="assigneeName"
            label="步骤负责人姓名"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="actDefDesc"
            label="步骤节点描述"
            minWidth="140"
          >
            <template #default="{ row }">
              <div class="actDefDescCell">{{ row.actDefDesc }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="completionDeadline"
            label="完成时限"
            align="center"
            width="100"
          >
            <template #default="{ row }">
              <div>{{ row.completionDeadline || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="durationDays"
            label="工期天数"
            width="80"
            align="center"
          >
            <template #default="{ row }">
              <div>{{ row.durationDays || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="completeTime"
            label="完成时间"
            align="center"
            width="160"
          >
            <template #default="{ row }">
              <div>{{ row.completeTime || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="completeDesc"
            label="完成情况"
            align="left"
            width="140"
          >
            <template #default="{ row }">
              <div>{{ row.completeDesc || '-' }}</div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </BaseForm>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';

import { getAuthUser } from '@/utils/auth';
import { ApiListUser } from '@/http/setting/user.js';
import { ApiDeptList } from '@/http/setting/department.js';

import { ApiDetailProject } from '@/http/process/processManagement.js';
import { formItems as formItemsData } from './data';

defineOptions({ name: 'ProcessModalDetailContent' });

const user = getAuthUser();

const pending = ref(false);
const projectId = ref('');
/** 责任部门选项 */
const responsibleDepts = ref([]);
/** 合同管理人选项 */
const listUser = ref([]);
// 表单
const BaseFormRef = ref(null);
const formValue = ref({});
const formItems = ref([...formItemsData]);
// 步骤节点
const processConfigs = ref([]);

// 监听项目责任部门
watch(
  () => formValue.value.responsibleDeptId,
  async (value) => {
    try {
      // 项目管理人
      const item_contractAdminId = formItems.value.find(
        (item) => item.name === 'contractAdminId'
      );
      // 项目管理人
      const item_responsibleAdminId = formItems.value.find(
        (item) => item.name === 'responsibleAdminId'
      );

      if (!item_contractAdminId || !item_responsibleAdminId) return;

      // 无选项则不清空数据，处理初始化赋值不清空
      if (!!item_contractAdminId.options?.length) {
        formValue.value = {
          ...formValue.value,
          contractAdminId: [],
        };
      }
      if (!!item_responsibleAdminId.options?.length) {
        formValue.value = {
          ...formValue.value,
          responsibleAdminId: [],
        };
      }

      // 处理新的负责人的选项
      if (!value) {
        item_contractAdminId.options = [];
        item_responsibleAdminId.options = [];
      } else {
        const res = await ApiListUser({
          orgId: user.orgId,
          deptId: value,
        });

        listUser.value =
          res?.map((item) => ({
            label: item.userName,
            value: item.userId,
          })) || [];
        if (item_contractAdminId) {
          item_contractAdminId.options = res;
          item_responsibleAdminId.options = res;
        }
      }
    } catch (error) {
      ElMessage.error(`${error}`);
    }
  }
);

const base = async () => {
  try {
    // 获取url参数
    const paramsStr = window.location.href.split('?')[1];
    const params = new URLSearchParams(paramsStr);
    projectId.value = params.get('projectId');

    const Item_responsibleDeptId = formItems.value.find(
      (item) => item.name === 'responsibleDeptId'
    );
    responsibleDepts.value = await ApiDeptList({
      orgId: user.orgId,
    });
    Item_responsibleDeptId.options = responsibleDepts.value;
  } catch (error) {
    ElMessage.error(`${error}`);
  }
};

const init = async () => {
  try {
    pending.value = true;
    const res = await ApiDetailProject({ projectId: projectId.value });
    formValue.value = {
      ...res.projectInfo,
    };
    processConfigs.value =
      res.processConfigs?.map((item) => {
        return {
          ...item,
          key: item.actDefId,
        };
      }) || [];
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

onMounted(async () => {
  await base();
  await init();
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
      border-color: $colorBorder !important;
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
