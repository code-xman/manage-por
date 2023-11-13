<template>
  <div v-loading="pending" class="base-table flex-all column">
    <el-table
      :data="listData"
      :row-key="rowKey"
      ref="tableRef"
      size="small"
      class="flex-1"
      border
      stripe
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
      <el-table-column
        v-for="(column, index) in showColumns"
        :key="index"
        :type="column.type"
        :prop="column.prop"
        :label="column.label"
        :header-align="column.headerAlign || column.align || 'center'"
        :align="column.align || 'center'"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :width="column.width"
        :min-width="column.minWidth"
        :class-name="column.className"
        :formatter="column.formatter"
        :show-overflow-tooltip="
          column.showOverflowTooltip === undefined
            ? true
            : column.showOverflowTooltip
        "
      />

      <el-table-column
        v-if="$slots.options"
        label="操作"
        align="center"
        fixed="right"
        :width="optionsSize"
      >
        <template #default="{ row }">
          <slot name="options" :row="row" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="needPage" class="pagination">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :disabled="disabled"
        :background="background"
        layout="sizes, prev, pager, next, jumper, total,"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { computed, ref, onMounted } from 'vue';

const emit = defineEmits(['selectChange', 'radioSelectChange']);

const props = defineProps({
  /** 表格列 */
  columns: {
    type: Array,
    default: () => [],
  },
  /** 表格数据 */
  list: {
    type: [Function, Array],
    default: () => [],
  },
  /** 默认参数 */
  defaultParams: {
    type: Object,
    default: () => ({}),
  },
  /** 搜索参数 */
  searchParams: {
    type: Object,
    default: () => ({}),
  },
  /** 行数据的 Key */
  rowKey: String,
  /** 操作列宽度 */
  optionsSize: [Number, String],
  /** 是否需要分页 */
  needPage: {
    type: Boolean,
    default: true,
  },
});

const pending = ref(false);

/** 表格数据 */
const listData = ref([]);

/** 是否禁用 */
const disabled = ref(false);
/** 是否为分页按钮添加背景色 */
const background = ref(true);
/** 当前页数 */
const pageNum = ref(1);
/** 每页显示条目个数 */
const pageSize = ref(20);
/** 总条目个数 */
const total = ref(0);
/** 展示的列 */
const showColumns = computed(() => {
  return props.columns || [];
});

// 加载列表数据
const fetchData = async () => {
  try {
    pending.value = true;
    if (typeof props.list === 'function') {
      const dataRes = await props.list({
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        ...props.defaultParams,
        ...props.searchParams,
      });
      listData.value = dataRes?.list || [];
      total.value = dataRes.total;
    }
    if (Array.isArray(props.list)) {
      listData.value = props.list;
    }
  } catch (error) {
    console.log('error :>> ', error);
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

// 多选变更
const handleSelectionChange = (val) => {
  emit('selectChange', val);
};
// 单选变更
const handleCurrentChange = (val) => {
  if (val) {
    emit('radioSelectChange', val);
  }
};

// 分页更新
const handlePageSizeChange = (size) => {
  pageNum.value = 1;
  pageSize.value = size;
  fetchData();
};

// 分页更新
const handlePageCurrentChange = (current) => {
  pageNum.value = current;
  fetchData();
};

onMounted(() => {
  fetchData();
});

defineExpose({
  fetchData,
});
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
:deep(.el-table__row) {
  .cell-full {
    padding: 0;
    height: 100%;
    .cell.el-tooltip {
      padding: 0;
      height: 100%;

      // 为了使高度 100% 撑满
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
