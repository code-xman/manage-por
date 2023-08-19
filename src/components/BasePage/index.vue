<template>
  <div class="base-page flex-all column">
    <div class="page-form">
      <SearchForm
        v-if="!!searchFormItems && !!searchFormItems?.length"
        :searchFormItems="searchFormItems"
        v-model:searchFormValue="searchFormVal"
        @on-search="onSearchFn"
      ></SearchForm>
    </div>
    <BaseBtn :btns="btns" />
    <div class="page-table flex-1">
      <BaseTable
        ref="baseTableRef"
        :columns="columns"
        :list="list"
        :searchParams="searchFormVal"
        :defaultParams="defaultParams"
        :options-size="optionsSize"
      >
        <template #options="{ row }">
          <slot name="options" :row="row"></slot>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash';
import SearchForm from '@/components/BasePage/SearchForm';
import BaseTable from '@/components/BaseTable';
import BaseBtn from '@/components/BaseBtn';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['update:searchFormValue', 'on-search']);

const props = defineProps({
  /** 搜索form各项配置 */
  searchFormItems: {
    type: Array,
    default: () => [],
  },
  /** 搜索form数据 */
  searchFormValue: {
    type: Object,
    default: () => ({}),
  },
  /** 请求默认参数 */
  defaultParams: {
    type: Object,
    default: () => ({}),
  },
  /** 页面按钮 */
  btns: {
    type: Array,
    default: () => [],
  },
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

const baseTableRef = ref(null);

const searchFormVal = ref(cloneDeep(props.searchFormValue));

watch(
  () => searchFormVal.value,
  () => {
    emit('update:searchFormValue', searchFormVal.value);
  }
);

// 刷新页面
const refresh = () => {
  try {
    baseTableRef.value?.fetchData();
  } catch (error) {
    ElMessage.error(`${error}`)    
  }
};

const onSearchFn = () => {
  // 不再往上触发 on-search ，直接触发baseTable的刷新
  // emit('on-search');
  baseTableRef.value?.fetchData();
};

defineExpose({
  refresh,
})
</script>

<style lang="scss" scoped>
.page-table {
  height: calc(100% - 122px);
}
</style>
