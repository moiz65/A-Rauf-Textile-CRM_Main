import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
// import CustomersHeader from '../components/CustomersHeader';
import CustomersTable from '../components/CustomersTable';

const Customers = () => {
  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-3">
      <Sidebar />
      
        <main className="flex-1 p-6 bg-[#F5F5F5]">
        <Header name="A RAUF TEXTILE" />
        {/* <CustomersHeader /> */}
        <CustomersTable />
       </main>
      </div>
    
  );
};

export default Customers;