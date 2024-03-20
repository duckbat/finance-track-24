import TransactionRow from "../../components/TransactionRow";
import { useTransaction } from "../../hooks/graphQLHooks";

const Feed = () => {
  const { transactionArray } = useTransaction();

  return (
    <div className="flex justify-center">
      <div className="space-y-5">
        {transactionArray.map((item) => (
          <TransactionRow key={item.transaction_id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
