import {Link} from 'react-router-dom';
import { TransactionWithOwner } from '../types/DBTypes';

const ExpenseRow = (props: {
  item: TransactionWithOwner
}) => {
  const {item} = props;

  return (
    <tr className='transaction-row'>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{item.amount}</td>
      <td>{new Date (item.created_at).toLocaleString('fi-FI')}</td>
      <td>
        <Link to="/single" state={item}>Edit</Link>
      </td>
    </tr>
  );
}

export default ExpenseRow;
