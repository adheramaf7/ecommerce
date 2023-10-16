'use client';

import { Plus } from 'lucide-react';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SizeColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface SizeClientProps {
   data: SizeColumn[];
}

const SizeClient = ({ data }: SizeClientProps) => {
   const router = useRouter();
   const params = useParams();

   return (
      <>
         <div className="flex items-center justify-between">
            <Heading title={`Sizes (${data.length})`} description="Manage Sizes for your store" />
            <Button onClick={() => router.push(`/${params.storeId}/sizes/create`)}>
               <Plus className="mr-2 h-4 w-4" />
               Add New
            </Button>
         </div>
         <Separator />
         <DataTable columns={columns} data={data} searchKey="label" />
         <Heading title="API" description="API calls for Size" />
         <Separator />
         <ApiList entityName="sizes" entityIdName="sizeId" />
      </>
   );
};

export default SizeClient;
