'use client';

import { Suspense, useState } from 'react';
import BrowseClient from './BrowseClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <BrowseClient />
    </Suspense>
  );
}