import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu từ API khi trang được load
    axios.get('/api/payments/vnpay-return', { params: { ...window.location.search } })
      .then(response => {
        setPaymentData(response.data);
      })
      .catch(err => {
        setError(err.response.data);
      });
  }, []);

  if (error) {
    return <div>{error.error}</div>;
  }

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="success-box">
        <h1>Giao dịch thành công</h1>
        <p>Cảm ơn bạn đã sử dụng dịch vụ VNPAY.</p>
        <div className="info">
          <p><strong>Mã giao dịch:</strong> {paymentData.transactionId}</p>
          <p><strong>Số tiền:</strong> {paymentData.amount}</p>
          <p><strong>Thời gian:</strong> {paymentData.paymentTime}</p>
        </div>
        <a href="/" className="back-btn">Quay về trang chủ</a>
      </div>
    </div>
  );
}

export default PaymentSuccess;