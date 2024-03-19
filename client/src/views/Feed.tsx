import TransactionRow from "../components/TransactionRow";
import { useTransaction } from "../hooks/graphQLHooks";

const Feed = () => {
  const { transactionArray } = useTransaction();

  return (
    <>
      <figure>
        <figure>
          {transactionArray.map((item) => (
            <TransactionRow key={item.transaction_id} item={item} />
          ))}
        </figure>
      </figure>
    </>
  );
};

export default Feed;
