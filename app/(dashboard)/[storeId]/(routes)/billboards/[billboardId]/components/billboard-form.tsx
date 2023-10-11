'use client';

import * as z from 'zod';
import { Billboard, Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
import { ImageUpload } from '@/components/ui/image-upload';

const formSchema = z.object({
   label: z.string().min(1),
   imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
   initialData: Billboard | null;
}

const BillboardForm = ({ initialData }: BillboardFormProps) => {
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const params = useParams();
   const router = useRouter();

   const title = initialData ? 'Edit Billboard' : 'Create Billboard';
   const description = initialData ? 'Edit a Billboard' : 'Add a new Billboard';
   const toastMessage = initialData ? 'Billboard Updated' : 'Billboard Created';
   const action = initialData ? 'Save Changes' : 'Create';

   const form = useForm<BillboardFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || { label: '', imageUrl: '' },
   });

   const onSubmit = async (values: BillboardFormValues) => {
      try {
         setLoading(true);

         if (initialData) {
            await axios.patch(
               `/api/stores/${params.storeId}/billboards/${params.billboardId}`,
               values
            );
         } else {
            await axios.post(`/api/stores/${params.storeId}/billboards`, values);
         }

         router.refresh();
         router.push(`/${params.storeId}/billboards`);

         toast.success(toastMessage);
      } catch (error) {
         toast.error('Something went wrong.');
      } finally {
         setLoading(false);
      }
   };

   const onDelete = async () => {
      try {
         setLoading(true);

         await axios.delete(`/api/stores/${params.storeId}/billboards/${params.billboardId}`);

         router.refresh();
         router.push(`/${params.storeId}/billboards`);

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
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  variant={'destructive'}
                  size={'sm'}
                  onClick={() => setOpen(true)}
                  disabled={loading}>
                  <Trash className="h-4 w-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
               <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <ImageUpload
                           disabled={loading}
                           value={field.value ? [field.value] : []}
                           onChange={(url) => field.onChange(url)}
                           onRemove={(_) => field.onChange('')}
                        />
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="grid grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="label"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Label</FormLabel>
                           <FormControl>
                              <Input disabled={loading} placeholder="Billboard label" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
         <Separator />
      </>
   );
};

export default BillboardForm;
