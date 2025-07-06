import axios from 'axios';

import type { DemonlistLevel } from '../types/demonlist';

export async function getDemonList() {
  const response = await axios.get<{ data: DemonlistLevel[] }>(
    '/api/demonlist'
  );

  if (response.data?.data && Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  {
    return [];
  }
}
