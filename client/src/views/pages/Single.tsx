import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { MediaItemWithOwner } from '../../types/DBTypes';
import Comments from '../../components/Comments';


const Single = () => {
  const {state} = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const item: MediaItemWithOwner = state;

  return (
    <>
      <div className="flex-column align-center w-full overflow-hidden">
        {item.media_type.includes('video') ? (
          <video controls src={item.filename}></video>
        ) : (
          <img src={item.filename} alt={item.title} />
        )}
        <button
          className=" m-6 w-full rounded-md text-white bg-blue-700 p-3"


          onClick={() => {
            navigate(-1);
          }}
        >
          Go Back
        </button>
        <Comments item={item} />
      </div>
            <h1 style={{marginBottom: '50vh', overflow: 'none', font: 'xxl'}}></h1>

    </>
  );
};

export default Single;
