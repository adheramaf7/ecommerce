'use client';

import * as z from 'zod';
import { Color, Store } from '@prisma/client';
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
   name: z.string().min(1),
   value: z.string().min(1),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
   initialData: Color | null;
}

const ColorForm = ({ initialData }: ColorFormProps) => {
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const params = useParams();
   const router = useRouter();

   const title = initialData ? 'Edit Color' : 'Create Color';
   const description = initialData ? 'Edit a Color' : 'Add a new Color';
   const toastMessage = initialData ? 'Color Updated' : 'Color Created';
   const action = initialData ? 'Save Changes' : 'Create';

   const form = useForm<ColorFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || { name: '', value: '' },
   });

   const onSubmit = async (values: ColorFormValues) => {
      try {
         setLoading(true);

         if (initialData) {
            await axios.patch(`/api/stores/${params.storeId}/colors/${params.colorId}`, values);
         } else {
            await axios.post(`/api/stores/${params.storeId}/colors`, values);
         }

         router.refresh();
         router.push(`/${params.storeId}/colors`);

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

         await axios.delete(`/api/stores/${params.storeId}/colors/${params.colorId}`);

         router.refresh();
         router.push(`/${params.storeId}/colors`);

         toast.success('Color Deleted.');
      } catch (error) {
         toast.error('Make sure you removed all products using this color first.');
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
                  color={'sm'}
                  onClick={() => setOpen(true)}
                  disabled={loading}>
                  <Trash className="h-4 w-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
               <div className="grid grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input disabled={loading} placeholder="Color name" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="value"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Value</FormLabel>
                           <FormControl>
                              <Input disabled={loading} placeholder="Color value" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
               <Button
                  disabled={loading}
                  className="ml-3"
                  variant={'outline'}
                  type="button"
                  onClick={() => router.push(`/${params.storeId}/colors`)}>
                  Cancel
               </Button>
            </form>
         </Form>
      </>
   );
};

export default ColorForm;
