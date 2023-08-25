import { getAuthBtn } from '@/utils/auth.js';

const btns = getAuthBtn();

export const allowDirective = {
  mounted: (el, bind) => {
    const flag = !!btns?.map((b) => b.menuId)?.includes(bind.value);
    if (flag) return;
    if (!flag) {
      el.style.opacity = 0;
      el.style.pointerEvents = 'none';
      el.style.margin = 0;
      el.style.border = 0;
      el.style.width = 0;
      el.style.height = 0;
      el.style.padding = 0;
      el.style.float = 'left';
      el.style.overflow = 'hidden';
    }
  },
};
