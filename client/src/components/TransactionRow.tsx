import { TransactionWithOwner } from '../types/DBTypes';
import { Link } from 'react-router-dom';

const TransactionRow = (props: { item: TransactionWithOwner }) => {
  const { item } = props;

  return (
    <>
      <Link
        className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 xl:max-w-6xl xl:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        to="/single"
        state={item}
      >
        <img
          className="h-96 w-full rounded-t-lg object-cover xl:h-auto xl:w-96 xl:rounded-none xl:rounded-l-lg"
          src={item.thumbnail}
          alt={item.title}
        />
        <div className="flex flex-col justify-between p-4 leading-normal w-full">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {item.title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {item.description}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            by: {item.owner.username}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {item.amount.toFixed(2)}€
          </p>
          <Link
            className="bg-slate-600 p-2 text-center hover:bg-slate-950"
            to="/single"
            state={item}
          >
            View
          </Link>
        </div>
      </Link>
    </>
  );
};

export default TransactionRow;
