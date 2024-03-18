// // import {useState} from 'react';
// // import {useForm} from '../hooks/formHooks';
// // import {useFile, useTransaction} from '../hooks/graphQLHooks';
// // import {useNavigate} from 'react-router-dom';

// // // Upload.tsx
const Upload = () => {
// //   const [file, setFile] = useState<File | null>(null);
// //   const {postFile} = useFile();
// //   const {postTransaction} = useTransaction();
// //   const navigate = useNavigate();

// //   const initValues = {
// //     title: '',
// //     description: '',
// //   };

// //   const doUpload = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token || !file) {
// //         return;
// //       }
// //       // TODO: call postFile function (see below)
// //       const fileResult = await postFile(file, token);
// //       // TODO: call postTransaction function (see below)
// //       const transactionResult = await postTransaction(fileResult, inputs, token);
// //       alert(transactionResult.message);
// //       // TODO: redirect to Home
// //       navigate('/');
// //     } catch (e) {
// //       console.log((e as Error).message);
// //     }
// //   };

//   // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   if (e.target.files) {
//   //     setFile(e.target.files[0]);
//   //   }
//   // };

//   // const {handleSubmit, handleInputChange, inputs} = useForm(
//   //   doUpload,
//   //   initValues,
//   // );

  return (
    <>

    </>
  );
};

export default Upload;
