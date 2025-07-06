import axios from 'axios';

import type { DGKRListLevel } from '../types/demonlist';

// Github - https://gist.githubusercontent.com/ZhulinskiiDanil/8133426c3ec239bbb1ce103f6401bb87
// Raw    - https://gist.githubusercontent.com/ZhulinskiiDanil/8133426c3ec239bbb1ce103f6401bb87/raw

const gistLink =
  'https://gist.githubusercontent.com/ZhulinskiiDanil/8133426c3ec239bbb1ce103f6401bb87/raw';

// Get json from github gist
export async function getDGKRList() {
  try {
    const response = await axios.get(gistLink, {
      headers: {
        Accept: 'application/json',
      },
    });

    let data: DGKRListLevel[] = [];

    if (typeof response.data === 'string') {
      try {
        const parsed = JSON.parse(response.data);
        if (Array.isArray(parsed)) {
          data = parsed;
        }
      } catch (err) {
        console.log(err);
        return [];
      }
    } else if (Array.isArray(response.data)) {
      data = response.data;
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
