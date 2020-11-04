import { json2csvAsync } from 'json-2-csv';

export async function generateCsvBlob(data: unknown): Promise<Blob> {
  const csv = await json2csvAsync(JSON.parse(JSON.stringify(data)));
  return new Blob([csv]);
}

export function createDownloadElement(
  blob: Blob,
  fileName: string
): HTMLAnchorElement {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  return link;
}
