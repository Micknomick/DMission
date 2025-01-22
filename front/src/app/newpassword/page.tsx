import React, { Suspense } from 'react';
import UpdatePassword from '@/components/layout/password/UpdatePassword';

export default function Page() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <UpdatePassword />
    </Suspense>
  );
}
