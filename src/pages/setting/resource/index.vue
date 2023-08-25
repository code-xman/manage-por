<template>
  <div class="auth-resource">
    <div class="search flex">
      <div class="flex-1">
        <SearchForm
          :searchFormItems="searchFormItems"
          v-model:searchFormValue="searchFormVal"
          @on-search="onSearchFn"
        ></SearchForm>
      </div>
      <div class="btns">
        <el-button type="primary" plain @click="handleExpandToggle(true)">
          展开全部
        </el-button>
        <el-button type="primary" plain @click="handleExpandToggle(false)">
          收起全部
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="pending"
      :data="resources"
      :expand-row-keys="['0000']"
      class="table"
      ref="tableTreeRef"
      row-key="menuId"
      stripe
      border
    >
      <el-table-column type="index" label="#" align="center" width="48" />
      <el-table-column
        prop="menuName"
        label="权限名称"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column prop="menuId" label="权限ID" align="center" width="320">
        <template #default="{ row }">
          <template v-if="row.menuId === '0000'">-</template>
          <template v-else>
            {{ row.menuId }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="120">
        <template #default="{ row }">
          <template v-if="row.menuId === '0000'">-</template>
          <template v-else>
            {{ row.authorityType ? row.authorityType.label : '-' }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <template v-if="row.menuId === '0000'">-</template>
          <template v-else>
            <template v-if="row.menuStatus">
              <BTag v-if="row.menuStatus.value === '01'" type="success">
                {{ row.menuStatus.label || '-' }}
              </BTag>
              <BTag v-else type="danger">
                {{ row.menuStatus.label || '-' }}
              </BTag>
            </template>
            <template v-else>-</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220">
        <template #default="{ row }">
          <div class="flex operate">
            <template v-if="row.menuId !== '0000'">
              <el-button type="primary" link @click="handleEditRow(row)">
                编辑
              </el-button>

              <!-- TODO: 暂时不使用删除 -->
              <!-- <el-button link @click="handleRemoveRow(row)">
                <span class="color-danger">删除</span>
              </el-button> -->

              <template v-if="row.menuStatus">
                <el-button
                  v-if="row.menuStatus.value === '02'"
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

            <el-button
              v-if="row.authorityType && row.authorityType.value === '1'"
              type="primary"
              link
              @click="handleAddRow(row)"
            >
              新增子级
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 弹窗 :: 新增或编辑资源 -->
  <ModalEdit
    v-model="modalEdit"
    :parent="modalCurrentRow"
    :row="modalEditRow"
    @on-success="fetchResource"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import SearchForm from '@/components/BasePage/SearchForm';
import BTag from '@/components/baseCommon/BTag';
import {
  ApiFindMenuTree,
  ApiDeleteMenu,
  ApiDisableMenu,
  ApiEnableMenu,
} from '@/http/setting/resource.js';
import { searchFormItems } from './data';
import ModalEdit from './ModalEdit.vue';

const pending = ref(false);
const tableTreeRef = ref(null);
const searchFormVal = ref({
  // menuStatus: '01', // 权限状态 01 正常 | 02 禁用
});
const resources = ref([]);
const modalEdit = ref(false);
const modalCurrentRow = ref(null);
const modalEditRow = ref(null);

onMounted(() => {
  fetchResource();
});

// 全量权限，扁平层级
const resourcesFlat = computed(() => {
  const res = [];

  const _merge = (data) => {
    data.forEach((row) => {
      res.push(row);
      if (row.children) {
        _merge(row.children);
      }
    });
  };

  _merge([...resources.value]);

  return res;
});

watch(modalEdit, (visible) => {
  if (visible) return;
  modalCurrentRow.value = null;
  modalEditRow.value = null;
});

// 展开或收起全部
const handleExpandToggle = (expand, data) => {
  (Array.isArray(data) ? data : resources.value).forEach((row) => {
    tableTreeRef.value?.toggleRowExpansion(row, !!expand);
    if (Array.isArray(row.children)) {
      handleExpandToggle(!!expand, row.children);
    }
  });
};

// 加载权限树
const fetchResource = async () => {
  try {
    pending.value = true;
    resources.value = await ApiFindMenuTree(searchFormVal.value);
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

// 搜索
const onSearchFn = () => {
  fetchResource();
};

const handleFilterSubmit = () => {
  fetchResource();
};

const handleFilterReset = () => {
  fetchResource();
};

// 编辑行
const handleEditRow = (row) => {
  const parent = resourcesFlat.value.find((res) => res.menuId === row.parentId);
  if (parent) {
    modalCurrentRow.value = parent;
  }
  modalEditRow.value = { ...row };
  modalEdit.value = true;
};

// 新增子级
const handleAddRow = (row) => {
  modalCurrentRow.value = row;
  modalEdit.value = true;
};

// 启用或禁用
const handleToggleRow = async (row) => {
  try {
    // 状态错误
    if (!row.menuStatus) throw '资源状态错误，请联系管理员';
    const isEnable = row.menuStatus.value === '02';
    if (isEnable) {
      await ElMessageBox.confirm('启用权限信息，确认是否继续？', '操作提示', {
        type: 'warning',
      });

      pending.value = true;
      await ApiEnableMenu({menuId: row.menuId});
      
    } else {
      await ElMessageBox.confirm('禁用权限信息，确认是否继续？', '操作提示', {
        type: 'warning',
      });

      pending.value = true;
      await ApiDisableMenu({menuId: row.menuId});
    }

    resources.value = await ApiFindMenuTree(searchFormVal.value);
    ElMessage.success('操作成功');
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

// 删除
const handleRemoveRow = async (row) => {
  try {
    await ElMessageBox.confirm('删除权限信息，确认是否继续？', '操作提示', {
      type: 'warning',
    });
    pending.value = true;

    await ApiDeleteMenu(row.menuId);

    resources.value = await ApiFindMenuTree(searchFormVal.value);

    ElMessage.success('操作成功');
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};
</script>

<style lang="scss" scoped>
.auth-resource {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep([rowspan='1'] .el-table__placeholder) {
    display: none;
  }
  .search {
    flex-shrink: 0;
    .btns {
      margin-bottom: 8px;
      border-bottom: 1px solid $colorBorder;
      height: 49px;
    }
  }
  .table {
    flex: 1;
    .operate {
      justify-content: flex-start;
    }
  }
}
</style>
