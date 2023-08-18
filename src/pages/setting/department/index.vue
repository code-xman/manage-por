<template>
  <div v-loading="pending" class="department full">
    <SearchForm
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormVal"
      @on-search="onSearchFn"
    ></SearchForm>
    <!-- <div>
      <el-button class="btn" type="primary" @click="handleAdd">
        新增
      </el-button>
    </div> -->
    <el-table
      :data="tree"
      row-key="departmentId"
      stripe
      border
      default-expand-all
    >
      <el-table-column type="index" label="#" align="center" width="48" />
      <el-table-column
        prop="departmentName"
        label="部门名称"
        min-width="220"
        show-overflow-tooltip
      />
      <el-table-column
        label="员工信息"
        align="center"
        width="200"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.userNames || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        label="所属机构"
        align="center"
        width="220"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.orgName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <template v-if="row.departmentId === '0000'">-</template>
          <template v-else>
            <template v-if="row.status">
              <BTag v-if="row.status.value === '01'" type="success">
                {{ row.status.label || '-' }}
              </BTag>
              <BTag v-else type="danger">
                {{ row.status.label || '-' }}
              </BTag>
            </template>
            <template v-else>-</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template #default="{ row }">
          <div class="flex main-start">
            <template v-if="row.departmentId !== '0000'">
              <el-button type="primary" link @click="handleEditRow(row)">
                编辑
              </el-button>

              <template v-if="row.status">
                <el-button
                  v-if="row.status.value === '02'"
                  link
                  @click="handleToggleRow(row)"
                >
                  <span class="color-success">启用</span>
                </el-button>
                <el-button v-else link @click="handleToggleRow(row)">
                  <span class="color-danger">禁用</span>
                </el-button>
              </template>
            </template>

            <el-button type="primary" link @click="handleAddRow(row)">
              新增子级
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <ModalEdit
      v-model="showModel"
      :type="modalType"
      :row="showModelRow"
    ></ModalEdit>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import SearchForm from '@/components/BasePage/SearchForm';
import BTag from '@/components/baseCommon/BTag';
import {
  ApiDepartmentTree,
  ApiChangeStatus,
} from '@/http/setting/department.js';
import ModalEdit from './ModalEdit.vue';
import { data_test, searchFormItems } from './data';
import { getAuthUser } from '@/utils/auth';

const user = getAuthUser();

const pending = ref(false);
const searchFormVal = ref({});
const tree = ref([]);

const modalType = ref('');
const showModel = ref(false);
const showModelRow = ref({});

const getData = async () => {
  try {
    pending.value = true;
    tree.value = await ApiDepartmentTree({
      ...searchFormVal.value,
    });
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

const onSearchFn = () => {
  getData();
};

/** 编辑 */
const handleEditRow = (row) => {
  modalType.value = 'edit';
  showModelRow.value = row;
  showModel.value = true;
};
/** 启用 / 禁用 */
const handleToggleRow = async (row) => {
  try {
    pending.value = true;
    await ElMessageBox.confirm(
      `${row.status.value === '01' ? '禁用' : '启用'}${
        row.departmentName || '此项'
      }，确认是否继续？`,
      {
        type: 'warning',
        title: '操作提示',
        closeOnClickModal: false,
      }
    );

    await ApiChangeStatus({
      departmentId: row.departmentId,
      // 01-正常,02-禁用
      status: row.status.value === '01' ? '02' : '01',
    });
    getData();
    ElMessage.success('操作成功');
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

/** 新增根级部门 */
const handleAdd = () => {
  modalType.value = 'add';
  showModelRow.value = {
    orgId: searchFormVal.value.orgId || user.orgId,
  };
  showModel.value = true;
};
/** 新增子级部门 */
const handleAddRow = (row) => {
  modalType.value = 'addSon';
  showModelRow.value = row;
  showModel.value = true;
};

// 弹框关闭更新数据
watch(
  () => showModel.value,
  () => {
    if (!showModel.value) {
      getData();
    }
  }
);

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.department {
  height: 100%;

  display: flex;
  flex-direction: column;

  .btn {
    margin-bottom: 8px;
  }
  .el-table {
    flex: 1;
  }
}
</style>
