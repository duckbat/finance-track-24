import {useState} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Example = (props: any) => {
  const [name, setName] = useState<string>('Khai Dang');
  const [count, setCount] = useState<number>(21);
  return (
    <div>
      <h1>This is my name from props: {props.name}</h1>
      <h2>I am this age:{props.age}</h2>
      <h2>This is my updated name from useState: {name}</h2>
      <h2>This is my +1 age from button below {count}</h2>
      <hr />
      <input
        type="text"
        value={name ? name : ''}
        onChange={(e) => setName(e.target.value)}
      />
      <hr />
      <button
        onClick={() => setCount(count + 1)}
        className="rounded-full bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-700"
      >
        Add one more year to my life
      </button>
    </div>
  );
};
export default Example;
