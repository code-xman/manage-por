<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :size="formSize"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :style="{
      marginLeft: `${labelWidth * 0.1}px`,
      marginRight: `${labelWidth * 0.3}px`,
    }"
    class="base-form flex-1"
  >
    <template v-for="item in newFormItems" :key="item.name">
      <el-form-item
        :prop="item.name"
        :label="item.label"
        class="form-item half-width"
        :class="[`${item.className || ''}`, widthAuto ? 'width_auto' : '']"
        :style="item.style || {}"
      >
        <div v-if="item.type === 'text'">{{ formData[item.name] }}</div>
        <template v-else-if="item.type === 'select'">
          <template v-if="props.formType === 'detail'">
            <!-- 单选 -->
            <p v-if="!item.attrs?.multiple">
              {{
                item.options.find(
                  (option) => option.value === formData[item.name]
                )?.label || '-'
              }}
            </p>
            <!-- 多选 -->
            <template v-else>
              <p>
                {{
                  formData[item.name]
                    ?.map((fd) => {
                      return (
                        item.options.find((option) => option.value === fd)
                          ?.label || '-'
                      );
                    })
                    ?.join('、') || '-'
                }}
              </p>
            </template>
          </template>
          <el-select
            v-else
            :placeholder="`请选择${item.label}`"
            v-bind="item.attrs"
            :modelValue="formData[item.name]"
            @update:modelValue="(val) => formValueChange(val, item.name)"
          >
            <template v-if="item.useSelfTmp">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <span style="float: left">{{ option.label }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 12px;
                  "
                >
                  {{ option.text }}
                </span>
              </el-option>
            </template>
            <template v-else>
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </template>
          </el-select>
        </template>
        <template v-else-if="item.type === 'dateTime'">
          <p v-if="props.formType === 'detail'">
            {{ formData[item.name] }}
          </p>
          <el-date-picker
            v-else
            v-model="formData[item.name]"
            :placeholder="`请选择${item.label}`"
            v-bind="{ type: 'date', ...item.attrs }"
            @update:modelValue="(val) => formValueChange(val, item.name)"
          />
        </template>
        <template v-else-if="item.type === 'radio'">
          <p v-if="props.formType === 'detail'">
            {{
              item.options.find(
                (option) => option.value === formData[item.name]
              )?.label || '-'
            }}
          </p>
          <el-radio-group
            v-else
            v-bind="item.attrs"
            :modelValue="formData[item.name]"
            @update:modelValue="(val) => formValueChange(val, item.name)"
          >
            <el-radio v-for="option in item.options" :label="option.value">
              <template #default>
                <div
                  v-if="option.slot"
                  v-html="option.slot"
                  class="radio-slot"
                ></div>
                <span v-else>{{ option.label }}</span>
              </template>
            </el-radio>
          </el-radio-group>
        </template>
        <template v-else-if="item.type === 'number'">
          <p v-if="props.formType === 'detail'">
            {{
              item.format
                ? item.format(formData[item.name])
                : formData[item.name]
            }}
          </p>
          <el-input-number
            v-else
            :placeholder="`请输入${item.label}`"
            v-bind="{
              controls: false,
              ...item.attrs,
            }"
            :modelValue="formData[item.name]"
            @update:modelValue="(val) => formValueChange(val, item.name)"
          />
        </template>
        <template v-else>
          <p v-if="props.formType === 'detail'">
            {{ formData[item.name] }}
          </p>
          <el-input
            v-else
            :placeholder="`请输入${item.label}`"
            v-bind="item.attrs"
            :modelValue="formData[item.name]"
            @update:modelValue="(val) => formValueChange(val, item.name)"
          />
        </template>
      </el-form-item>
    </template>
    <slot name="formAfter"></slot>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { ElMessage } from 'element-plus';

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
  /** 表单类型 */
  formType: {
    type: String,
    default: 'edit',
  },
});

// form的ref
const formRef = ref(null);
// form的当前组件的数据
const formData = ref({});
const newFormItems = ref([]);

watch(
  () => props.formItems,
  async () => {
    try {
      // Promise.all map 处理循环里的请求
      newFormItems.value = await Promise.all(
        props.formItems.map(async (item) => {
          if (item.type === 'select' && typeof item.options === 'function') {
            const options = await item.options();
            return {
              ...item,
              options,
            };
          }
          return item;
        })
      );
    } catch (error) {
      ElMessage.error(`${error}`);
    }
  },
  {
    immediate: true,
  }
);

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
    deep: true, // 需要deep，否则form里面的table数据无法同步更新
  }
);
// 验证
const validate = async () => {
  try {
    await formRef.value?.validate();
  } catch (error) {
    throw 'cancel';
  }
};
// 验证某一项
const validateField = async (params) => {
  try {
    await formRef.value?.validateField(params);
  } catch (error) {
    // throw 'cancel';
  }
};
// 重置
const resetFields = async () => {
  try {
    await formRef.value?.resetFields();
  } catch (error) {
    throw 'cancel';
  }
};

// 清除验证
const clearValidate = async () => {
  try {
    await formRef.value?.clearValidate();
  } catch (error) {
    throw 'cancel';
  }
};

defineExpose({
  formRef,
  formData,
  validate,
  validateField,
  resetFields,
  clearValidate,
});
</script>

<style lang="scss" scoped>
.base-form {
  display: flex;
  flex-wrap: wrap;
  .half-width:not(.width_auto, .full-width) {
    width: 50%;
  }
  .full-width {
    width: 100%;
  }

  .el-select,
  :deep(.el-input),
  .el-input-number {
    width: 100%;
  }
  .el-input-number {
    :deep(.el-input) {
      .el-input__wrapper {
        padding: 1px 11px;
        .el-input__inner {
          text-align: left;
        }
      }
    }
  }
}
</style>
