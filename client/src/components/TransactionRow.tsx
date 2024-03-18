import {TransactionWithOwner} from '../types/DBTypes';
import {useUpdateContext, useUserContext} from '../hooks/ContextHooks';
import {useTransaction} from '../hooks/graphQLHooks';
import {Link} from 'react-router-dom';

const TransactionRow = (props: {item: TransactionWithOwner}) => {
  const {item} = props;
  const {user} = useUserContext();
  const {deleteTransaction} = useTransaction();
  const {update, setUpdate} = useUpdateContext();

  const deleteHandler = async () => {
    const cnf = confirm('Are you sure you want to delete this media?');
    if (!cnf) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const result = await deleteTransaction(item.transaction_id, token);
      alert(result.message);
      setUpdate(!update);
    } catch (e) {
      console.error('delete failed', (e as Error).message);
    }
  };

  return (
    <tr className="*:p-4">
      <td className="border-slate-700 flex items-center justify-center border">
        <img
          className="h-60 w-72 object-cover"
          src={item.thumbnail}
          alt={item.title}
        />
      </td>
      <td className="border-slate-700 border">{item.title}</td>
      <td className="border-slate-700 text-ellipsis border">
        {item.description}
      </td>
      <td className="border-slate-700 border">
        {new Date(item.created_at).toLocaleString('fi-FI')}
      </td>
      <td className="border-slate-700 border">{item.filesize}</td>
      <td className="border-slate-700 border">
        {item.media_type.replace('&#x2F;', '/')}
      </td>
      <td className="border-slate-700 border">{item.owner.username}</td>
      <td className="border-slate-700 border">
        <div className="flex flex-col">
          <Link
            className="bg-slate-600 hover:bg-slate-950 p-2 text-center"
            to="/single"
            state={item}
          >
            View
          </Link>
          {user &&
            (user.user_id === item.user_id || user.level_name === 'Admin') && (
              <>
                <button
                  className="bg-slate-700 hover:bg-slate-950 p-2"
                  onClick={() => console.log('modify', item)}
                >
                  Modify
                </button>
                <button
                  className="bg-slate-800 hover:bg-slate-950 p-2"
                  onClick={deleteHandler}
                >
                  Delete
                </button>
              </>
            )}
        </div>
        <p>Comments: {item.comments_count}</p>
      </td>
    </tr>
  );
};

export default TransactionRow;
