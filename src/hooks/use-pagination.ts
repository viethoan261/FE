import { useSetState } from '@mantine/hooks';
import { useMemo } from 'react';

interface Paging {
  page: number;
  pageSize: number;
}

interface UsePagination<T> {
  defaultPaging?: Paging;
  data: T[];
}

const usePagination = <T = unknown>({
  defaultPaging = {
    page: 1,
    pageSize: 20
  },
  data: _data
}: UsePagination<T>) => {
  const [paging, setPaging] = useSetState<Paging>(defaultPaging);

  const offset = useMemo(() => (paging.page - 1) * paging.pageSize, [paging]);
  const data = useMemo(() => {
    if (!_data?.length) return [];
    const start = offset;
    let end = offset + paging.pageSize;
    if (start >= _data?.length) {
      end = -1;
    }
    return _data.slice(start, end);
  }, [_data, offset, paging]);

  const changePage = (page: number) => setPaging({ page });
  const changePageSize = (pageSize: number) => setPaging({ pageSize, page: 1 });

  return {
    ...paging,
    data,
    changePage,
    changePageSize
  };
};

export default usePagination;
