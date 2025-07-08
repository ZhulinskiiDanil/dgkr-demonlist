import { getDemonList } from '@/shared/api/getDemonList';
import { getDGKRList } from '@/shared/api/getDGKRList';

export default async function NotFound() {
  const demonlist = await getDemonList();
  const dgkrList = await getDGKRList();
  // const data = await getSiteData(domain);

  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p>demonlist: {JSON.stringify(demonlist)}</p>
      <p>dgkrList: {JSON.stringify(dgkrList)}</p>
    </div>
  );
}
