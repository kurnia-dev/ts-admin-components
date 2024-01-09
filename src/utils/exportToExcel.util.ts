import * as XLSX from 'xlsx';

interface IExcelOptions {
  headers: string[];
  data: object[];
  filename: string;
}

const exportToExcel = async (options: IExcelOptions) => {
  const heading = [options.headers];
  const workbook = XLSX.utils.book_new();
  const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(workSheet, heading);

  XLSX.utils.sheet_add_json(workSheet, options.data, {
    origin: 'A2',
    skipHeader: true,
  });
  XLSX.utils.book_append_sheet(workbook, workSheet, 'Sheet1');
  const timestamps = new Date()
    .toLocaleDateString('en-gb', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replaceAll('/', '');
  XLSX.writeFile(workbook, `${options.filename}-${timestamps}.xlsx`);
};

export default exportToExcel;