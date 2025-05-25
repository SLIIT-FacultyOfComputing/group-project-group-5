import React from 'react';

export const TableSkeleton = () => (
  <table className="w-full text-sm text-left text-gray-500">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3">ID</th>
        <th scope="col" className="px-6 py-3">Name</th>
        <th scope="col" className="px-6 py-3">Category</th>
        <th scope="col" className="px-6 py-3">Status</th>
        <th scope="col" className="px-6 py-3">Purchase Date</th>
        <th scope="col" className="px-6 py-3">Maintenance</th>
        <th scope="col" className="px-6 py-3">Warranty</th>
        <th scope="col" className="px-6 py-3">Actions</th>
      </tr>
    </thead>
    <tbody className="animate-pulse">
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="bg-white border-b">
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-28"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-6 py-4"><div className="h-12 bg-gray-200 rounded w-28"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-16"></div></td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const CardSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);