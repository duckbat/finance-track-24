import MediaRow from "../../components/MediaRow";
import { useMedia } from "../../hooks/graphQLHooks";

const Feed = () => {
  const { mediaArray } = useMedia();

  return (
    <>
    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Check our Feed</h1>
    <hr className="pb-5"/>
    <div className="flex justify-center">
      <div className="space-y-5">
        {mediaArray.map((item) => (
          <MediaRow key={item.media_id} item={item} />
        ))}
      </div>
    </div>
    </>
  );
};

export default Feed;
