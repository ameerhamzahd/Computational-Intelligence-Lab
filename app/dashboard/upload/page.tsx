"use client";

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadStats from '@/components/dashboard/user/upload/UploadStats';
import UploadPaperForm from '@/components/dashboard/user/upload/UploadPaperForm';
import UploadPresentationForm from '@/components/dashboard/user/upload/UploadPresentationForm';
import { UploadSkeleton } from '@/components/dashboard/skeleton-loader/UploadSkeleton';
import { useDashboardLoading } from '@/lib/hooks/use-dashboard-loading';
import { cn } from '@/lib/utils';

export default function UploadPage() {
  const { isLoading, refresh } = useDashboardLoading();

  return (
    <section className='w-[95%] min-w-0 max-w-full mx-auto py-5'>
      <div className="mb-6">
        <div className='flex items-center justify-between'>
          <h1 className="text-2xl font-bold text-white">Upload Papers & Presentations</h1>

          <div className='flex gap-1'>
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              onClick={refresh}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} aria-hidden />
              <p className='hidden md:block'>Reload</p>
            </Button>
          </div>
        </div>

        <p className="text-white/80 mt-1">Manage your research papers and presentation uploads</p>
      </div>

      {isLoading ? <UploadSkeleton /> : <UploadStats />}

      <div className="w-full min-w-0 mt-6">
        <div className="min-w-0 space-y-6">
          <UploadPaperForm />
          <UploadPresentationForm />
        </div>
      </div>
    </section>
  );
}