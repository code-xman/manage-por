<template>
  <div class="department full">
    <el-table
      v-loading="pending"
      :data="tree"
      row-key="departmentId"
      size="small"
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
        label="所属商户"
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
      <el-table-column label="操作" align="center" fixed="right" width="165">
        <template #default="{ row }">
          <div class="flex main-start">
            <template v-if="row.departmentId !== '0000'">
              <el-button link @click="handleEditRow(row)"> 编辑 </el-button>

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

            <el-button link @click="handleAddRow(row)"> 新增子级 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BTag from '@/components/baseCommon/BTag';
import { data_test } from './data';

const pending = ref(false);
const tree = ref([...data_test.data]);

/** 编辑 */
const handleEditRow = (row) => {};
/** 启用 / 禁用 */
const handleToggleRow = (row) => {};
/** 新增子级 */
const handleAddRow = (row) => {};
</script>

<style lang="scss" scoped>
.el-table {
  height: 100%;
}
</style>
