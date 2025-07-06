'use client';
import { useQuery } from '@tanstack/react-query';
import { getDGKRList } from '../api/getDGKRList';

export function useDGKRListQuery() {
  const response = useQuery({
    queryKey: ['dgkr-list'],
    queryFn: getDGKRList,
    initialData: [],
  });

  return response;
}
