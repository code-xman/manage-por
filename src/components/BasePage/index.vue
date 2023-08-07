<template>
  <div class="base-page flex-all column">
    <div class="page-form">
      <SearchForm
        :searchFormItems="searchFormItems"
        v-model:searchFormValue="searchFormVal"
        @on-search="onSearchFn"
      ></SearchForm>
    </div>
    <div class="page-table flex-1">
      <BaseTable
        ref="baseTableRef"
        :columns="columns"
        :list="list"
        :searchParams="searchFormVal"
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
  /** 表格列 */
  columns: {
    type: Array,
    default: () => [],
  },
  /** 表格数据 */
  list: {
    type: Function,
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

const onSearchFn = () => {
  emit('on-search');
  baseTableRef.value?.fetchData();
};
</script>

<style lang="scss" scoped></style>
