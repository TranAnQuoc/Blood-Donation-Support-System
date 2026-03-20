import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransfusionProcessDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Chi tiet qua trinh nhan mau
      </h2>

      <p className="mb-4">
        Chuc nang xu ly qua trinh nhan mau cho yeu cau #{requestId || 'N/A'} chua duoc BE ho tro day du.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Quay lai
      </button>

      <ToastContainer />
    </div>
  );
};

export default TransfusionProcessDetail;
