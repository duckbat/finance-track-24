import Example from '../components/Example';
import mock from '../db/mock-data.json'

const Profile = () => {
  return (
    <>
      <div className="mb-8 rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-600">
        <img
          src="https://getducked.com.au/cdn/shop/products/2124_hr_1024x1024.png?v=1612084811"
          className="h-20"
          alt="DuckBat Logo"
        />
        <h1 className="text-align:right font-sans text-4xl">Duck Home</h1>
        <h1>Profile Page</h1>
        <Example age={21} name={'Khai Dang'} />
      </div>
      <h1>Profile page</h1>
        <h1>{JSON.stringify(mock)}</h1>
      <h1 style={{marginBottom: '1500px', overflow: 'none', font: 'xxl'}}>
        Empty component
      </h1>
    </>
  );
};

export default Profile;
