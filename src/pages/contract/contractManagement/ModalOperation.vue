<template>
  <el-drawer
    v-model="modal"
    title="操作记录"
    size="90%"
    append-to-body
    destroy-on-close
    @close="onCloseFn"
  >
    <div class="content full-y flex x-center">
      <BaseTable
        :columns="columns"
        :defaultParams="defaultParams"
        :list="ApiListBizModifyRecord"
        :needPage="false"
      ></BaseTable>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="onCloseFn">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import BaseTable from '@/components/BaseTable/index';
import { ApiListBizModifyRecord } from '@/http/contract/contractManagement';

defineOptions({ name: 'ModalOperation' });

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  row: {
    type: Object,
  },
});

const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'bizNo',
    label: '合同编号',
    width: '160px',
  },
  {
    prop: 'content',
    label: '修改原因',
    minWidth: '240px',
    headerAlign: 'center',
    align: 'left',
  },
  {
    prop: 'rawCreateUser',
    label: '修改人',
    width: '120px',
  },
  {
    prop: 'rawCreateTime',
    label: '修改时间',
    width: '160px',
  },
];
const defaultParams = computed(() => ({
  pageNum: undefined,
  pageSize: undefined,
  bizNo: props.row?.contractNo,
}));

const modal = ref(false);

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
  }
);

const onCloseFn = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped></style>
