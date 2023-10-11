'use client';

import { Button } from '@/components/ui/button';
import { BillboardColumn } from './columns';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import { AlertModal } from '@/components/modals/alert-modal';

interface CellActionProps {
   data: BillboardColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const params = useParams();

   const onCopy = () => {
      navigator.clipboard.writeText(data.id);
      toast.success('ID copied to the clipboard.');
   };

   const onUpdate = () => router.push(`/${params.storeId}/billboards/${data.id}`);

   const onDelete = async () => {
      try {
         setLoading(true);

         await axios.delete(`/api/stores/${params.storeId}/billboards/${data.id}`);

         router.refresh();

         toast.success('Billboard Deleted.');
      } catch (error) {
         toast.error('Make sure you removed all categories using this billboard first.');
      } finally {
         setLoading(false);
         setOpen(false);
      }
   };

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant={'ghost'} className="w-8 h-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuItem onClick={onCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy ID
               </DropdownMenuItem>
               <DropdownMenuItem onClick={onUpdate}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};
