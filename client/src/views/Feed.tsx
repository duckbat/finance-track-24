// import ExpenseRow from "../components/ExpenseRow";
// import { useTransaction } from "../hooks/graphQLHooks";

const Feed = () => {
  // const { transactionArray } = useTransaction();
  return (
    <>
      <h1>Feed page</h1>
      <h1 style={{marginBottom: '1500px', overflow: 'none', font: 'xxl'}}>
        Empty component
      </h1>
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
          </tr>
        </thead>
        {/* <tbody>
          {transactionArray.map((item)=>(
            <ExpenseRow
            key={item.transaction_id}
            item={item} />
          ))}
        </tbody> */}
      </table>
    </>
  );
};

export default Feed;
