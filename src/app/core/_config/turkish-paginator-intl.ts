import { MatPaginatorIntl } from '@angular/material';

const turkishRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 dan ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} dan ${length}`;
}


export function getTurkishPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'Her sayfadaki kayıt sayısı:';
  paginatorIntl.nextPageLabel = 'Sonraki Sayfa';
  paginatorIntl.previousPageLabel = 'Önceki Sayfa';
  paginatorIntl.lastPageLabel = 'Son Sayfa';
  paginatorIntl.firstPageLabel = 'İlk Sayfa';
  paginatorIntl.getRangeLabel = turkishRangeLabel;
  
  return paginatorIntl;
}