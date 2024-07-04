import { ElMessageBox } from 'element-plus';

export const useReasonConfirm = async (text='修改') => {
  return await ElMessageBox.prompt(
    `请输入${text}原因并确认是否继续操作？`,
    {
      title: '提示',
      type: 'warning',
      closeOnClickModal: false,
      dangerouslyUseHTMLString: true,
      showInput: true,
      inputType: 'textarea',
      customClass: 'set-msg-textarea',
      inputPlaceholder: `请输入${text}原因`,
      inputValidator: (value) => {
        if (!value) {
          return `请输入${text}原因`;
        }
        if (value.length > 200) {
          return `${text}原因最多可输入200个字符`;
        }
        return true;
      },
    }
  );
}
