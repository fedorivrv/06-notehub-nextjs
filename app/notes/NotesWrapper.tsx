"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotesClient from "./Notes.client";

export default function NotesWrapper() {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NotesClient />
    </QueryClientProvider>
  );
}