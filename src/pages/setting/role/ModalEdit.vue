<template>
  <el-drawer
    v-model="modal"
    :title="modalTitle"
    size="90%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div v-loading="pending" class="content">
      <BaseForm
        ref="BaseFormRef"
        v-model:formValue="formValue"
        :formItems="formItems"
        :rules="rules"
      ></BaseForm>
      <div class="menu-auth-config">
        <div class="header">
          <h4>岗位角色权限</h4>
          <div class="flex-1" />
          <el-button type="primary" link @click="handleExpandToggle(true)">
            展开全部
          </el-button>
          <el-button type="primary" link @click="handleExpandToggle(false)">
            收起全部
          </el-button>
          <el-button type="primary" link @click="handleSelectAll">
            全选
          </el-button>
          <el-button type="primary" link @click="handleClearAll">
            取消选择
          </el-button>
        </div>
        <el-tree
          :data="menus"
          ref="roleTreeRef"
          node-key="menuId"
          :props="{
            label: 'menuName',
            children: 'children',
          }"
          :default-checked-keys="menusChecked"
          :expand-on-click-node="false"
          style="width: 100%"
          default-expand-all
          check-strictly
          show-checkbox
          @check="handleMenuChange"
        >
          <template #default="{ node, data }">
            <div class="flex cross-center expand">
              <div class="expand flex cross-center">
                <div class="font-size-small">{{ node.label }}</div>
                <div
                  v-if="data.authorityType"
                  class="font-size-small color-gray"
                >
                  【{{ data.authorityType.label }}】
                </div>
              </div>
              <template
                v-if="Array.isArray(data.children) && data.children.length"
              >
                <el-button
                  type="primary"
                  link
                  @click="handleSelectNodeChild(data)"
                >
                  全选
                </el-button>
                <el-button
                  type="primary"
                  link
                  @click="handleClearNodeChild(data)"
                >
                  取消选择
                </el-button>
              </template>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
        <el-button :disabled="pending" type="primary" @click="confirmClick"
          >确定</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';
import { ApiFindCanConfigMenuTree } from '@/http/setting/resource.js';
import { ApiCreateRole, ApiUpdateRole } from '@/http/setting/role.js';
import { modalTitleObj, PlatformOrgId } from '@/data/common.js';
import { formItems } from './data';

import { getAuthUser } from '@/utils/auth';
const user = getAuthUser();

defineOptions({ name: 'OrganModalEdit' });

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    default: 'edit',
  },
  row: {
    type: Object,
    default: () => ({}),
  },
});

const modal = ref(false);
const modalTitle = computed(() => {
  return modalTitleObj[props.type];
});

const pending = ref(false);
const BaseFormRef = ref(null);
const formValue = ref({});

const rules = ref({
  roleName: [{ required: true, message: '请填写岗位角色名称' }],
  orgId: [{ required: true, message: '请选择所属机构' }],
  roleType: [{ required: true, message: '请选择岗位角色类型' }],
});

const roleTreeRef = ref(null);
const menus = ref([]);
const childMerchant = ref([]);
const menusFlat = ref([]);
const menusChecked = ref([]); // 已选择的权限

// 展开或收起全部
const handleExpandToggle = (expand) => {
  const nodes = roleTreeRef.value?.store.nodesMap;
  for (let i in nodes) {
    nodes[i].expanded = !!expand;
  }
};

// 全选
const handleSelectAll = () => {
  roleTreeRef.value?.setCheckedNodes(menusFlat.value);
  menusChecked.value = roleTreeRef.value?.getCheckedKeys();
};

// 取消选择
const handleClearAll = () => {
  roleTreeRef.value?.setCheckedNodes([]);
  menusChecked.value = roleTreeRef.value?.getCheckedKeys();
};

// 选中指定节点的所有直接父级
const deepChangeParents = (menu) => {
  // 递归选择父级
  const _deepEach = (node) => {
    // 添加当前节点
    roleTreeRef.value?.setChecked(node, true);

    // 递归选中父级节点
    if (node.parentId !== '') {
      const _parent = menusFlat.value.find(
        (set) => set.menuId === node.parentId
      );
      _deepEach(_parent);
    }
  };

  // 执行递归选择父级
  _deepEach(menu);

  // 选中当前节点
  menusChecked.value = roleTreeRef.value?.getCheckedNodes();
};

// 全选指定的所有后代节点
const handleSelectNodeChild = (node) => {
  if (!roleTreeRef.value) return;

  // 选择直系父级
  deepChangeParents(node);

  // 选择子级
  const _deepEach = (node) => {
    // 取消当前节点
    roleTreeRef.value?.setChecked(node, true);

    // 递归取消选择子级
    if (Array.isArray(node.children)) {
      node.children.forEach((sub) => {
        _deepEach(sub);
      });
    }
  };

  // 执行递归取消选择
  _deepEach(node);

  menusChecked.value = roleTreeRef.value?.getCheckedKeys();
};

// 取消选择指定的所有后代节点
const handleClearNodeChild = (node) => {
  // 取消选择子级
  const _deepEach = (node) => {
    // 取消当前节点
    roleTreeRef.value?.setChecked(node, false);

    // 递归取消选择子级
    if (Array.isArray(node.children)) {
      node.children.forEach((sub) => {
        _deepEach(sub);
      });
    }
  };

  // 执行递归取消选择
  _deepEach(node);

  menusChecked.value = roleTreeRef.value?.getCheckedKeys();
};

// 选择权限
const handleMenuChange = (node, checked) => {
  if (checked.checkedKeys.includes(node.menuId)) {
    // 如果该节点已选中，则向上查找，选择各层父级
    deepChangeParents(node);
  } else {
    // 如果未选中，向下查找，移除选择项
    deepUnChangeChild(node);
  }

  // 更新值
  menusChecked.value = roleTreeRef.value?.getCheckedKeys();
};

// 扁平化处理数据
const flatMenu = (data) => {
  const res = [];

  // 遍历处理数据
  const _expand = (arr) => {
    arr.forEach((menu) => {
      const _row = { ...menu };

      if (Array.isArray(menu.children)) {
        _expand(menu.children);
      }

      res.push(_row);
    });
  };

  _expand(data);

  return res;
};

// 获取菜单树
const fetchMenuTree = async () => {
  try {
    pending.value = true;

    const { row } = props;
    let _menus = {};

    // 步客加载全量菜单
    _menus = await ApiFindCanConfigMenuTree({
      roleId: row?.roleId ? row.roleId : '',
      orgId: row?.orgId ? row.orgId : formValue.value.orgId,
    });

    menus.value = [_menus];
    menusFlat.value = flatMenu([_menus]);
    menusChecked.value = (_menus.checkedList || []).map((item) => item.value);
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

const cancelClick = () => {
  emit('update:modelValue', false);
};

const confirmClick = async () => {
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    if (menusChecked.value.length === 0) throw '请选择岗位角色权限';
    formValue.value.menuIds = [...menusChecked.value];

    if (props.type === 'add') {
      await ApiCreateRole(formValue.value);
    } else if (props.type === 'edit') {
      await ApiUpdateRole(formValue.value);
    }
    ElMessage.success('保存成功');
    emit('update:modelValue', false);
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

const onCloseFn = () => {
  emit('update:modelValue', false);
};

watch(
  () => formValue.value.orgId,
  (val) => {
    if (val) {
      fetchMenuTree();
    } else {
    }
  }
);

watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
    // 打开抽屉
    if (props.modelValue) {
      if (props.type === 'edit') {
        formValue.value = {
          roleId: props.row.roleId,
          roleName: props.row.roleName,
          roleType: props.row.roleType?.value,
          orgId: props.row.orgId,
        };
      }
      if (formValue.value.orgId) {
        // 获取菜单树
        await fetchMenuTree();
      }
      // 非平台
      if (user.orgId !== PlatformOrgId) {
        form.value.roleType = '02';
      }
    } else {
      // 关闭抽屉
      formValue.value = {};
      menusChecked.value = [];
    }
  }
);
</script>

<style lang="scss" scoped>
.menu-auth-config {
  margin: 0 56px;
  border: 1px $colorBorder solid;
  border-radius: 4px;
  position: relative;

  & > .header {
    background: #fff;
    align-items: center;
    display: flex;
    border-radius: 3px 3px 0 0;
    border-bottom: 1px $colorBorder solid;
    padding: 4px 8px;
    position: sticky;
    top: -20px;
    z-index: 2;

    h4 {
      font-size: 14px;
      font-weight: bold;
      padding: 0 8px;
    }
  }

  .el-tree {
    padding: $void;
  }
}
</style>
