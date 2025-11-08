import { QueryClient, dehydrate } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';

interface NoteDetailsPageProps {
  params: { id: string };
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  return (
    <NoteDetailsClient
      noteId={params.id}
      dehydratedState={dehydrate(queryClient)}
    />
  );
}
