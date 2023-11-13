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
            <span>步骤节点配置列表</span>
            <el-button v-if="!isDetail" type="primary" @click="handleAdd">
              新增节点配置
            </el-button>
            <el-button v-if="isDetail" type="primary" @click="handleProjectId">
              项目附件下载
            </el-button>
          </div>
          <el-table
            :data="formValue.processConfigs"
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
              prop="actDefName"
              label="步骤节点名称"
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="assigneeName"
              label="步骤负责人姓名"
              width="140"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="actDefDesc"
              label="步骤节点描述"
              minWidth="240"
              :show-overflow-tooltip="true"
            >
              <template #default="{ row }">
                <div class="actDefDescCell">{{ row.actDefDesc }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="completionDeadline"
              label="完成时限"
              align="center"
              width="140"
            >
              <template #default="{ row }">
                <div>{{ row.completionDeadline || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="durationDays"
              label="工期天数"
              width="120"
              align="center"
            >
            <template #default="{ row }">
                <div>{{ row.durationDays || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isDetail"
              prop="completeTime"
              label="完成时间"
              align="center"
              width="170"
            >
              <template #default="{ row }">
                <div>{{ row.completeTime || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isDetail"
              prop="completeDesc"
              label="完成情况"
              align="left"
              width="240"
            >
              <template #default="{ row }">
                <div>{{ row.completeDesc || '-' }}</div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="120"
            >
              <template #default="{ row }">
                <div v-if="!isDetail" class="operate">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="() => handleEdit(row)"
                  >
                    编辑
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
                <div v-else class="operate">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="() => handleActDefId(row)"
                  >
                    节点附件下载
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
  <ModalRowEdit
    v-model="showModel"
    :row="showModelRow"
    :type="props.type"
    :projectId="formValue.projectId || ''"
    @update="onUpdateRow"
  ></ModalRowEdit>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import FileSaver from 'file-saver';
import BaseForm from '@/components/BaseForm';

// import { uploadAction, uploadHeaders } from '@/config/base';
import { getAuthUser } from '@/utils/auth';
import { parseToDate } from '@/utils/string';
import { ApiListUser } from '@/http/setting/user.js';
import { ApiDeptList } from '@/http/setting/department.js';
import { modalTitleObj } from '@/data/common.js';

import {
  ApiCreateProject,
  ApiEditProject,
  ApiDetailProject,
  ApiDeleteProjectActConfig,
  ApiDownloadActDefId,
  ApiDownloadProjectId,
} from '@/http/process/processManagement.js';
import ModalRowEdit from './ModalRowEdit.vue';
import { formItems as formItemsData } from './data';

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

/** 是否是详情 */
const isDetail = computed(() => props.type === 'detail');

const user = getAuthUser();

const modal = ref(false);
const modalTitle = computed(() => {
  return modalTitleObj[props.type];
});

const pending = ref(false);
/** 责任部门选项 */
const responsibleDepts = ref([]);
/** 合同管理人选项 */
const listUser = ref([]);
// 表单
const BaseFormRef = ref(null);
const formValue = ref({});
const formItems = ref([...formItemsData]);
// 步骤节点配置弹框
const showModel = ref(false);
const showModelRow = ref({});
// 验证规则
const rules = ref({
  projectName: [{ required: true, message: '请输入项目名称' }],
  responsibleDeptId: [{ required: true, message: '请选择项目责任部门' }],
  contractAdminId: [{ required: true, message: '请选择项目管理人' }],
  projectContent: [{ required: true, message: '请输入项目内容' }],
});

/** 项目附件下载 */
const handleProjectId = async () => {
  try {
    // console.log('url :>> ', ApiDownloadProjectId(props.row.projectId));
    await ElMessageBox.confirm('项目附件下载，确认是否继续？', '操作提示', {
      type: 'warning',
    });
    pending.value = true;
    // window.open(ApiDownloadProjectId(props.row.projectId));
    FileSaver.saveAs(
      ApiDownloadProjectId(props.row.projectId),
      `${formValue.value.projectName}附件${Date.now()}`
    );
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

/** 节点附件下载 */
const handleActDefId = async (row) => {
  try {
    await ElMessageBox.confirm(
      `${row.actDefName}附件下载，确认是否继续？`,
      '操作提示',
      {
        type: 'warning',
      }
    );
    pending.value = true;
    FileSaver.saveAs(
      ApiDownloadActDefId(row.actDefId),
      `${row.actDefName}附件${Date.now()}`
    );
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

/** 新增记录 */
const handleAdd = () => {
  showModel.value = true;
  showModelRow.value = {
    key: Date.now(),
    actDefName: '', // 步骤节点名称
    assignee: '', // 步骤负责人
    actDefDesc: '', // 步骤节点描述
    completionDeadline: '', // 完成时限
  };
  // formValue.value?.processConfigs?.push();
};

/** 编辑步骤节点 */
const handleEdit = (row) => {
  showModel.value = true;
  showModelRow.value = row;
};
/** 删除步骤节点 */
const handleDelete = async (row) => {
  try {
    if (props.type === 'edit') {
      await ApiDeleteProjectActConfig({ actDefId: row.actDefId });
    }
    const index = formValue.value?.processConfigs.findIndex(
      (fp) => fp.key === row.key
    );
    formValue.value?.processConfigs.splice(index, 1);
    ElMessage.success('删除成功');
  } catch (error) {
    ElMessage.error(`${error}`);
  }
};
/** 更新步骤数据 */
const onUpdateRow = (newRow) => {
  const index = formValue.value?.processConfigs.findIndex(
    (fp) => fp.key === newRow.key
  );
  if (index >= 0) {
    formValue.value?.processConfigs.splice(index, 1, newRow);
  } else {
    formValue.value?.processConfigs?.push(newRow);
  }
};

// 保存处理表单数据
const handleFormValue = () => {
  formValue.value.contractAdminName =
    listUser.value?.find((lu) => lu.value === formValue.value.contractAdminId)
      ?.label || '';

  formValue.value.responsibleDeptName =
    responsibleDepts.value?.find(
      (rd) => rd.value === formValue.value.responsibleDeptId
    )?.label || '';

  if (props.type === 'copy') {
    formValue.value.gid = undefined;
    formValue.value.projectId = undefined;
  }

  return {
    projectParam: {
      ...formValue.value,
      processConfigs: undefined,
    },
    processConfigs: formValue.value.processConfigs,
  };
};

// 保存
const confirmClick = async () => {
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    const saveData = handleFormValue();
    // console.log('saveData :>> ', saveData);
    if (['add', 'copy'].includes(props.type)) {
      await ApiCreateProject(saveData);
    } else if (props.type === 'edit') {
      await ApiEditProject(saveData?.projectParam);
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
    const res = await ApiDetailProject({ projectId: props.row.projectId });
    formValue.value = {
      ...res.projectInfo,
      processConfigs: res.processConfigs,
    };
    formValue.value.processConfigs = formValue.value.processConfigs.map(
      (item) => {
        return {
          ...item,
          key: item.actDefId,
        };
      }
    );
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
  () => {
    modal.value = props.modelValue;
    if (['edit', 'copy', 'detail'].includes(props.type) && props.modelValue) {
      init();
    } else {
      formValue.value = { processConfigs: [] };
    }
  }
);

// 监听项目责任部门
watch(
  () => formValue.value.responsibleDeptId,
  async (value) => {
    try {
      // 项目管理人
      const item_contractAdminId = formItems.value.find(
        (item) => item.name === 'contractAdminId'
      );
      if (!item_contractAdminId) return;
      // 无选项则不清空数据，处理初始化赋值不清空
      if (!!item_contractAdminId.options?.length) {
        formValue.value = {
          ...formValue.value,
          contractAdminId: [],
        };
      }

      // 处理新的负责人的选项
      if (!value) {
        item_contractAdminId.options = [];
      } else {
        const res = await ApiListUser({
          orgId: user.orgId,
          deptId: value,
        });

        listUser.value = res;
        if (item_contractAdminId) {
          item_contractAdminId.options =
            res?.map((item) => ({
              label: item.userName,
              value: item.userId,
            })) || [];
        }
      }
    } catch (error) {
      ElMessage.error(`${error}`);
    }
  }
);

onMounted(async () => {
  try {
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
});
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
  }
}
.actDefDescCell {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
