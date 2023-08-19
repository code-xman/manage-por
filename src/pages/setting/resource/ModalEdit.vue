<template>
  <el-dialog
    v-model="modal"
    :title="row ? '编辑权限' : '新增权限'"
    width="640px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div v-loading="pending" class="modal">
      <div class="modal-body">
        <el-form
          :model="form"
          :rules="formRules"
          ref="form"
          label-width="140px"
          style="padding-top: 18px; padding-right: 60px"
        >
          <el-form-item label="上级权限" prop="parentId">
            <el-cascader
              v-model="form.parentId"
              :options="resources"
              separator=" - "
              :props="{
                checkStrictly: true,
                emitPath: false,
                value: 'menuId',
                label: 'menuName',
              }"
              style="width: 100%"
              filterable
              clearable
            />
          </el-form-item>
          <el-form-item v-if="row" label="权限ID" prop="menuId">
            <el-input v-model="form.menuId" readonly />
          </el-form-item>
          <el-form-item label="权限类型" prop="authorityType">
            <el-select
              v-model="form.authorityType"
              placeholder="请选择权限类型"
              style="width: 100%"
              clearable
            >
              <el-option label="菜单权限" value="1" />
              <el-option label="按钮权限" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="权限名称" prop="menuName">
            <el-input
              v-model="form.menuName"
              maxlength="255"
              placeholder="请输入权限名称"
              clearable
            />
            <div class="form-tips color-gray">如：用户管理</div>
          </el-form-item>
          <el-form-item label="权限适用等级" prop="useLevel">
            <el-select
              v-model="form.useLevel"
              placeholder="请选择权限适用等级"
              style="width: 100%"
              multiple
              clearable
            >
              <el-option
                v-for="item in USELEVEL_TYPE_ENUM"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="权限排序权重" prop="sort">
            <div style="width: 100%">
              <el-input-number
                v-model="form.sort"
                :min="0"
                :max="99999999"
                :step="1"
                placeholder="请输入权限排序权重"
                clearable
              />
            </div>
            <div class="expand form-tips color-gray">
              提示：权重值越大，排序越靠前
            </div>
          </el-form-item>
          <!-- <el-form-item label="权限路由KEY">
            <el-input
              v-model="form.menuRouterKey"
              maxlength="255"
              placeholder="请输入权限路由KEY"
              clearable
            />
            <div class="form-tips color-gray">如：contractUseReport</div>
          </el-form-item> -->
          <!-- <el-form-item label="权限路由">
            <el-input
              v-model="form.menuRoute"
              maxlength="255"
              placeholder="请输入权限路由"
              clearable
            />
            <div class="form-tips color-gray">
              如：/contract/contractUseReport
            </div>
          </el-form-item> -->
          <!-- <el-form-item label="图标ICON">
            <el-input
              v-model="form.iconCls"
              maxlength="255"
              placeholder="请输入图标ICON"
              clearable
            />
            <div class="form-tips color-gray">
              如：icon-add，该字段暂未正式使用
            </div>
          </el-form-item> -->
        </el-form>
      </div>
      <div class="modal-footer">
        <el-button :disabled="pending" @click="modal = false"> 取消 </el-button>
        <el-button type="primary" :disabled="pending" @click="handleSubmit">
          {{ row ? '保存修改' : '提交' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  ApiCreateMenu,
  ApiUpdateMenu,
  ApiFindMenuTree,
} from '@/http/setting/resource.js';
import { USELEVEL_TYPE_ENUM } from '@/data/common.js';

// 新增或编辑资源权限
export default defineComponent({
  name: 'ModalEdit',
  emits: ['update:modelValue', 'on-success'],
  props: {
    // 弹出状态
    modelValue: Boolean,

    // 指定的父级权限
    parent: {
      type: Object,
    },

    // 编辑的行
    row: {
      type: Object,
    },
  },
  data() {
    return {
      USELEVEL_TYPE_ENUM,
      modal: false,
      pending: false,
      resources: [],
      resourcesFlat: [],
      disibledRes: [], // 禁用选择的条目
      form: {
        parentId: '0000',
        authorityType: '1',
        sort: 0,
        useLevel: [],
      },
      formRules: {
        parentId: [{ required: true, message: '请选择上级菜权限' }],
        menuId: [{ required: true, message: '请选择权限ID' }],
        authorityType: [{ required: true, message: '请选择权限类型' }],
        menuName: [{ required: true, message: '请填写权限名称' }],
        sort: [{ required: true, message: '请选择权限排序权重' }],
        useLevel: [{required: true, message: '请选择权限适用等级'}],
      },
    };
  },
  watch: {
    modelValue(value) {
      this.modal = value;
    },
    modal(value) {
      if (value) {
        this.initResource();
      } else {
        this.$refs.form.resetFields();
        this.form = {
          parentId: '0000',
          authorityType: '1',
          sort: 0,
        };
        this.resources.splice(0);
        this.resourcesFlat.splice(0);
        this.disibledRes.splice(0);
      }
      this.$emit('update:modelValue', value);
    },
  },
  methods: {
    // 加载权限树
    async initResource() {
      try {
        const { row, parent } = this.$props;

        this.pending = true;

        // 加载资源树
        const resources = await ApiFindMenuTree({
          authorityType: '1',
        });

        this.resourcesFlat = this.getFlat(resources);

        if (row) {
          // 找出节点
          const currentRow = this.resourcesFlat.find(
            (set) => set.menuId === row.menuId
          );
          if (currentRow) {
            this.disibledRes = this.getChilds(currentRow);
          }
        }

        this.resources = this.parseResources(resources);

        // 如果指定了父级，则直接设置父级ID
        if (parent) {
          this.form.parentId = parent.menuId;
        }

        // 编辑模式
        if (row) {
          this.form = {
            parentId: row.parentId,
            authorityType: row.authorityType ? row.authorityType.value : '',
            menuId: row.menuId,
            menuName: row.menuName,
            menuRoute: row.menuRoute,
            menuRouterKey: row.menuRouterKey,
            iconCls: row.iconCls,
            sort: row.sort,
            useLevel: row.useLevel || [],
          };
        }
      } catch (error) {
        ElMessage.error(`${error}`);
      } finally {
        this.pending = false;
      }
    },

    // 扁平化所有节点
    getFlat(nodes) {
      const res = [];

      const _reduce = (data) => {
        data.forEach((item) => {
          res.push(item);
          if (Array.isArray(item.children)) {
            _reduce(item.children);
          }
        });
      };

      _reduce(nodes);

      return res;
    },

    // 查找指定节点及其所有后代节点，用于设置禁用项
    getChilds(node) {
      const nodes = [];

      const _deep = (data) => {
        data.forEach((item) => {
          nodes.push(item.menuId);
          if (Array.isArray(item.children)) {
            _deep(item.children);
          }
        });
      };

      _deep([node]);

      return nodes;
    },

    // 处理数据，禁用当前选择项
    parseResources(data) {
      const { row } = this;
      const res = [];

      data.forEach((item) => {
        item.disabled = row ? this.disibledRes.includes(item.menuId) : false;

        if (item.children) {
          item.children = this.parseResources(item.children);
        }

        res.push(item);
      });

      return res;
    },

    // 提交
    async handleSubmit() {
      try {
        const { row } = this.$props;

        await new Promise((resolve, reject) => {
          this.$refs.form.validate((valid) => {
            if (valid) resolve(true);
            reject('UN_VALIDATE');
          });
        });

        if (row) {
          await ElMessageBox.confirm('确定保存修改？', {
            title: '操作提示',
            type: 'warning',
            closeOnClickModal: false,
          });

          this.pending = true;
          await ApiUpdateMenu(this.form);
        } else {
          this.pending = true;
          await ApiCreateMenu(this.form);
        }

        ElMessage.success('操作成功');

        this.$emit('on-success');

        this.modal = false;
      } catch (error) {
        if (error === 'cancel') return;
        if (error === 'UN_VALIDATE') return ElMessage.error('请检查表单输入');
        ElMessage.error(`${error}`);
      } finally {
        this.pending = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
:deep(.el-select) {
  padding: 0;
  line-height: 0;

  .el-select__tags {
    padding: 2px 4px !important;
  }

  .el-input--suffix {
    min-height: 32px !important;
  }
}

.modal-footer {
  border-top: 1px $colorBorder solid;
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  padding: $void;
  position: relative;
}
</style>
