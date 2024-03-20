import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { TransactionWithOwner } from '../../types/DBTypes';

const Single = () => {
  const { state } = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const item: TransactionWithOwner = state;

  return (
    <>
      <h3>{item.title}</h3>
      {item.media_type && item.media_type.includes('video') ? (
        <video controls src={item.filename}></video>
      ) : (
        <img src={item.filename} alt={item.title} />
      )}
      <p>{item.description}</p>
      <p>{item.username}</p>
      <p>{item.filesize}</p>
      <p>{item.media_type}</p>
      <p>{item.amount}</p>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        go back
      </button>
    </>
  );
};

export default Single;
