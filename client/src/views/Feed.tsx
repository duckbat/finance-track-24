import TransactionRow from '../components/TransactionRow';
import { useTransaction } from '../hooks/graphQLHooks';

const Feed = () => {
  const { transactionArray } = useTransaction();

  return (
    <>
      <h2>My Media</h2>
      <table>
        <thead>
          <tr>
            <th className="w-3/12 border border-slate-700">Thumbnail</th>
            <th className="w-1/12 border border-slate-700">Title</th>
            <th className="w-2/12 border border-slate-700">Description</th>
            <th className="w-1/12 border border-slate-700">Created</th>
            <th className="w-1/12 border border-slate-700">Size</th>
            <th className="w-1/12 border border-slate-700">Category</th>
            <th className="w-1/12 border border-slate-700">Owner</th>
          </tr>
        </thead>
        <tbody>
          {transactionArray.map((item) => (
            // Add a null check before rendering the TransactionRow
            item && (
              <TransactionRow key={item.transaction_id} item={item} />
            )
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Feed;
