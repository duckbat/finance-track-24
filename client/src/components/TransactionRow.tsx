import { TransactionWithOwner } from "../types/DBTypes";
import { useUpdateContext, useUserContext } from "../hooks/ContextHooks";
import { useTransaction } from "../hooks/graphQLHooks";
import { Link } from "react-router-dom";

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
  <tr>
    <td>{item.transaction_id}</td>
    <td>{item.title}</td>
    <td>{item.amount}</td>
    <td>{item.owner.username}</td>
    <td>
      <Link to={`/edit-transaction/${item.transaction_id}`}>Edit</Link>
      {user && user.user_id === item.owner.user_id && (
        <button onClick={deleteHandler}>Delete</button>
      )}
    </td>
  </tr>
)
};

export default TransactionRow;
