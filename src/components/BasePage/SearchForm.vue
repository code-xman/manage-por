<template>
  <div
    class="search-form-box"
    ref="searchFormRef"
    :style="{
      height: `${searchHeight + 1}px`,
    }"
  >
    <BaseForm
      v-model:formValue="searchFormVal"
      :formItems="searchFormItems_show"
      :label-width="'auto'"
      :widthAuto="true"
      labelPosition="left"
      class="search-form"
    >
      <template #formAfter>
        <div class="btn-box">
          <el-button type="primary" @click="emit('on-search')">
            搜索
          </el-button>
          <el-button @click="onClearFn"> 清空 </el-button>
        </div>
      </template>
    </BaseForm>
    <el-button v-if="needExpand" class="expandBtn" link @click="changeExpand">
      {{ isExpand ? '收起' : '展开' }}
    </el-button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { cloneDeep } from 'lodash';
import BaseForm from '@/components/BaseForm';

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
});

/** searchForm ref */
const searchFormRef = ref(null);
/** 搜索初始化内容 清空使用 */
const searchFormInit = ref(cloneDeep(props.searchFormValue));
/** 搜索内容 */
const searchFormVal = ref(cloneDeep(props.searchFormValue));
/** 展示的搜索字段 */
const searchFormItems_show = ref([]);
/** 是否需要展开按钮 */
const needExpand = ref(false);
/** 是否展开 */
const isExpand = ref(false);
/** 搜索区域高度 */
const searchHeight = ref(48);

// 监听底层数据变化，同步更新给父级
watch(
  () => searchFormVal.value,
  () => {
    emit('update:searchFormValue', searchFormVal.value);
  }
);

// 清空
const onClearFn = () => {
  searchFormVal.value = cloneDeep(searchFormInit.value);
  nextTick(() => {
    emit('on-search')
  })
};

// 切换 展开/收起
const changeExpand = () => {
  isExpand.value = !isExpand.value;
  setTimeout(() => {
    searchHeight.value = searchFormRef.value.children[0].clientHeight;
    // console.log('searchHeight.value :>> ', searchHeight.value);
  }, 0);
  if (isExpand.value) {
    searchFormItems_show.value = props.searchFormItems;
  } else {
    searchFormItems_show.value = props.searchFormItems.filter(
      (item) => !item.attrs?.initHide
    );
  }
};

onMounted(() => {
  // 初始化搜索字段筛选
  searchFormItems_show.value = props.searchFormItems.filter(
    (item) => !item.attrs?.initHide
  );
  // 展示字段少于实际字段
  if (searchFormItems_show.value.length < props.searchFormItems.length) {
    needExpand.value = true;
  }
});
</script>

<style lang="scss" scoped>
.search-form-box {
  position: relative;
  margin-bottom: 8px;
  transition: 0.3s;
  .expandBtn {
    position: absolute;
    left: 50%;
    bottom: -10px;
    margin-left: -23px;
    padding: 2px 8px;
    background: #fff;
    &:hover,
    &:focus {
      background: #fff;
    }
  }
}
.search-form {
  // margin-bottom: 16px;
  border-bottom: 1px solid $colorBorder;
  padding-bottom: 8px;
  // align-items: center; // 公共组件已有flex属性

  &.base-form {
    :deep(.form-item) {
      margin: 0 24px 8px 0;
      .el-form-item__label-wrap {
        margin-right: 0 !important;
        width: auto;
      }
      .el-form-item__content {
        width: 160px;
      }
    }
    // .el-button {
    //   margin-bottom: 8px;
    // }
  }
}
</style>
