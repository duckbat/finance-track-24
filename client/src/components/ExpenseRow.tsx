// import React from 'react';
// import { Transaction } from '../types/DBTypes';
// import { Link } from 'react-router-dom';

// interface ExpenseRowProps {
//   transaction: Transaction;
// }

// const ExpenseRow: React.FC<ExpenseRowProps> = ({ transaction }) => {
//   return (
//     <tr className="media-row">
//       <td>
//         <img src={transaction.thumbnail} alt={transaction.title} />
//       </td>
//       <td>{transaction.title}</td>
//       <td>{transaction.description}</td>
//       <td>{new Date(transaction.created_at).toLocaleString('fi-FI')}</td>
//       <td>{transaction.filesize}</td>
//       <td>{transaction.media_type}</td>
//       <td>
//         <Link to="/single" state={transaction}>View</Link>
//       </td>
//     </tr>
//   );
// }

// export default ExpenseRow;
