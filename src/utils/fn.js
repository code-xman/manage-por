import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

// 导出Excel
export const exportExcel = (data, fileName, columns=[]) => {
  // 创建工作簿
  const _workbook = new ExcelJS.Workbook();
  // 添加工作表
  const worksheet = _workbook.addWorksheet('sheet1');

  const _columns = columns.filter((col) => col.prop);
  // 设置表格内容
  worksheet.columns = _columns.map((col) => {
    return {
      header: col.label,
      key: col.prop,
      width: Number((col.width || col.minWidth)?.replace('px', '') || 200) / 10,
    };
  });

  worksheet.addRows(data);

  // 导出表格
  _workbook.xlsx.writeBuffer().then((buffer) => {
    let _file = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(_file, fileName);
  });
};