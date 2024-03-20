import React, { useState } from 'react';
import { useForm } from '../../hooks/formHooks';
import { useFile, useTransaction } from '../../hooks/graphQLHooks';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const { postFile } = useFile();
  const { postTransaction } = useTransaction();
  const navigate = useNavigate();

  const initValues = {
    title: '',
    description: '',
    amount: '', // Make sure amount is initialized as a string
  };

  const doUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !file) {
        return;
      }

      const fileResult = await postFile(file, token);

      // Convert the amount to a number before passing to postTransaction
      const transactionResult = await postTransaction(fileResult, inputs, token);

      alert(transactionResult.message);
      navigate('/');
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const { handleSubmit, handleInputChange, inputs } = useForm(doUpload, initValues);

  return (
    <>
      <h1 className="pb-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Add Transaction
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="title">
            Title
          </label>
          <input
            className="m-3 w-2/3 rounded-md border border-slate-500 p-3 text-slate-950"
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
            value={inputs.title}
          />
        </div>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="description">
            Description
          </label>
          <textarea
            className="m-3 w-2/3  rounded-md border border-slate-500 p-3 text-slate-950"
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
            value={inputs.description}
          ></textarea>
        </div>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="file">
            File
          </label>
          <input
            className="m-3 w-2/3 rounded-md border border-slate-500 p-3 text-slate-50"
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex w-4/5 justify-end">
          <img
            className="w-2/3 p-6"
            src={
              file
                ? URL.createObjectURL(file)
                : 'https://via.placeholder.com/200?text=Choose+image'
            }
            alt="preview"
            width="200"
          />
        </div>
        <div className="flex w-4/5 justify-end">
          <button
            className="m-3 w-1/3 rounded-md bg-slate-600 p-3 disabled:text-slate-600"
            type="submit"
            disabled={file && inputs.title.length > 3 && inputs.description.length > 0 ? false : true}
          >
            Upload
          </button>
        </div>
      </form>
    </>
  );
};

export default Upload;
