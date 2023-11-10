'use client';

import React from 'react';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { OrderColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface OrderClientProps {
   data: OrderColumn[];
}

const OrderClient = ({ data }: OrderClientProps) => {
   return (
      <>
         <div className="flex items-center justify-between">
            <Heading title={`Orders (${data.length})`} description="Orders list for your store" />
         </div>
         <Separator />
         <DataTable columns={columns} data={data} searchKey="products" />
      </>
   );
};

export default OrderClient;
