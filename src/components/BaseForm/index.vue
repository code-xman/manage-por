<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :size="formSize"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :style="{
      paddingRight: `${labelWidth * 0.4}px`,
    }"
    class="base-form flex-1"
  >
    <template v-for="item in formItems" :key="item.name">
      <el-form-item
        :prop="item.name"
        :label="item.label"
        class="form-item half-width"
        :class="[`${item.className}`, widthAuto ? 'width_auto' : '']"
        :style="item.style || {}"
      >
        <div v-if="item.type === 'text'"> {{ formData[item.name] }} </div>
        <el-select
          v-else-if="item.type === 'select'"
          :placeholder="`请选择${item.label}`"
          v-bind="item.attrs"
          :modelValue="formData[item.name]"
          @update:modelValue="(val) => formValueChange(val, item.name)"
        >
          <el-option
            v-for="option in item.options"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-input
          v-else
          :placeholder="`请输入${item.label}`"
          v-bind="item.attrs"
          :modelValue="formData[item.name]"
          @update:modelValue="(val) => formValueChange(val, item.name)"
        />
      </el-form-item>
    </template>
    <slot name="formAfter"></slot>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash';

const emit = defineEmits(['update:formValue', 'formValue-change']);

const props = defineProps({
  /** 验证规则 */
  rules: {
    type: Object,
    default: () => ({}),
  },
  /** label的宽度 */
  labelWidth: {
    type: [String, Number],
    default: 140,
  },
  labelPosition: {
    type: String,
    default: 'right',
  },
  /** el-form的size */
  formSize: {
    type: String,
    default: '',
  },
  /** form的各项的配置内容 */
  formItems: {
    type: Array,
    default: () => [],
  },
  /** form的父级绑定数据 */
  formValue: {
    type: Object,
    default: () => ({}),
  },
  /** formItem 宽度是否自由 非50%100% */
  widthAuto: {
    type: Boolean,
    default: false,
  },
});

// form的ref
const formRef = ref(null);
// form的当前组件的数据
const formData = ref({});

// formitem的数据update触发此函数
const formValueChange = (val, name) => {
  // 同步更新当前组件的数据
  formData.value[name] = val;
  // 同步更新父级组件的数据，父级组件绑定的v-model:xxx="",可以通过emit('update:xxx', value)进行修改
  emit('update:formValue', formData.value);
  // emit('formValue-change');
};

// 监听传入的formValue，同步更新formData
watch(
  () => props.formValue,
  () => {
    formData.value = cloneDeep(props.formValue);
  },
  {
    immediate: true,
  }
);

const validate = async () => {
  try {
    await formRef.value?.validate();
  } catch (error) {
    throw 'cancel';
  }
};

defineExpose({
  formRef,
  formData,
  validate,
});
</script>

<style lang="scss" scoped>
.base-form {
  display: flex;
  flex-wrap: wrap;
  .half-width:not(.width_auto) {
    width: 50%;
  }
  .full-width {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }
}
</style>
