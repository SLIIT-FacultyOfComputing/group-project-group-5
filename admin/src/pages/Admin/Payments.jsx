import React, { useState } from 'react';
import axios from 'axios';

const Payments = () => {
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentDate: '',
    paymentMethod: 'cash',
    description: ''
  });

  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8090/api/payments', null, {
        params: {
          memberId: formData.memberId,
          amount: formData.amount,
          paymentMethod: formData.paymentMethod,
          description: formData.description
        }
      });
      
      setInvoice(response.data);
      setError('');
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      console.error('Payment error:', err);
    }
  };

  const generateInvoicePDF = () => {
    if (!invoice) return;

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .invoice { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 30px; }
            .amount { font-size: 24px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>GYMSYNC Invoice</h1>
              <p>Invoice Number: ${invoice.invoiceNumber}</p>
              <p>Date: ${new Date(invoice.paymentDate).toLocaleDateString()}</p>
            </div>
            <div class="details">
              <p><strong>Member ID:</strong> ${invoice.member.id}</p>
              <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
              <p><strong>Description:</strong> ${invoice.description}</p>
              <p class="amount">Amount: Rs.${invoice.amount}</p>
            </div>
            <div class="footer">
              <p>Thank you for your payment!</p>
              <p>GYMSYNC - Your Fitness Partner</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Entry</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
              Member ID
            </label>
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
              Payment Date
            </label>
            <input
              type="date"
              id="paymentDate"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              placeholder="Enter payment description (e.g., Monthly membership fee)"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {invoice && (
            <button
              type="button"
              onClick={generateInvoicePDF}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Print Invoice
            </button>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payments; 