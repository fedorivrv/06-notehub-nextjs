"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessege/ErrorMessege";

import { fetchNotes, deleteNote } from "@/lib/api";
import type { GetNoteResponse } from "@/lib/api";

import css from "./page.module.css";

export default function NotesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 12;

  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedQuery]);
  
  const { data, isLoading, error } = useQuery<GetNoteResponse>({
    queryKey: ["notes", debouncedQuery, currentPage],
    queryFn: () => fetchNotes(debouncedQuery, currentPage + 1, perPage),
    staleTime: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", debouncedQuery, currentPage],
      });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={({ selected }) => setCurrentPage(selected)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {error && <ErrorMessage />}

      {data && (
        <NoteList
          notes={data.notes}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setCurrentPage(0)}
          />
        </Modal>
      )}
    </div>
  );
}
