// import {Link} from 'react-router-dom';
// import {TransactionWithOwner} from '../types/DBTypes';
// import {useUpdateContext, useUserContext} from '../hooks/ContextHooks';
// import {useTransaction} from '../hooks/graphQLHooks';

// const ExpenseRow = (props: {item: TransactionWithOwner}) => {
//   const {item} = props;
//   const {user} = useUserContext();
//   const {deleteTransaction} = useTransaction();
//   const {update, setUpdate} = useUpdateContext();

//   const deleteHandler = async () => {
//     const cnf = confirm('Are you sure you want to delete this expense?');
//     if (!cnf) {
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         return;
//       }
//       const result = await deleteTransaction(item.transaction_id, token);
//       alert(result.message);
//       setUpdate(!update);
//     } catch (e) {
//       console.error('delete failed', (e as Error).message);
//     }
//   };

//   return (
//     <tr className="*:p-4">
//       <td className="flex items-center justify-center border border-slate-700">
//         <img
//           className="h-60 w-72 object-cover"
//           src={item.thumbnail}
//           alt={item.title}
//         />
//       </td>
//       <td className="border border-slate-700">{item.title}</td>
//       <td className="text-ellipsis border border-slate-700">
//         {item.description}
//       </td>
//       <td className="border border-slate-700">
//         {new Date(item.created_at).toLocaleString('fi-FI')}
//       </td>
//       <td className="border border-slate-700">{item.filesize}</td>
//       <td className="border border-slate-700">
//         {item.media_type.replace('&#x2F;', '/')}
//       </td>
//       <td className="border border-slate-700">{item.owner.username}</td>
//       <td className="border border-slate-700">
//         <div className="flex flex-col">
//           <Link
//             className="bg-slate-600 p-2 text-center hover:bg-slate-950"
//             to="/single"
//             state={item}
//           >
//             View
//           </Link>
//           {user &&
//             (user.user_id === item.user_id || user.level_name === 'Admin') && (
//               <>
//                 <button
//                   className="bg-slate-700 p-2 hover:bg-slate-950"
//                   onClick={() => console.log('modify', item)}
//                 >
//                   Modify
//                 </button>
//                 <button
//                   className="bg-slate-800 p-2 hover:bg-slate-950"
//                   onClick={deleteHandler}
//                 >
//                   Delete
//                 </button>
//               </>
//             )}
//         </div>
//         <p>Comments: {item.comments_count}</p>
//       </td>
//     </tr>
//   );
// };

// export default ExpenseRow;

import {Transaction} from '../types/DBTypes';
import {Link} from 'react-router-dom';

const ExpenseRow = (props: {transaction: Transaction}) => {
  const item = props.transaction;
  return (
    <tr className="media-row">
      <td>
        <img src={item.thumbnail} alt={item.title} />
      </td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
      <td>
        <Link to="/single" state={item}>View</Link>
      </td>
    </tr>
  );
}

export default ExpenseRow;
