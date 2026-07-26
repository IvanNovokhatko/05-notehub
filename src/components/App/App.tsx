import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { fetchNotes, deleteNote, createNote } from '../../services/noteService';
import type { CreateNotePayload } from '../../services/noteService';

export default function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const perPage = 12;


  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  const createMutation = useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
  <div className={css.app}>
    <header className={css.toolbar}>
      <SearchBox onChange={(e) => debouncedSearch(e.target.value)} />
      
      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          forcePage={page - 1}
          onPageChange={(targetPage) => setPage(targetPage)}
        />
      )}
      
      <button className={css.button} onClick={() => setIsModalOpen(true)}>
        Create note +
      </button>
    </header>

    {data && data.notes?.length > 0 && (
      <NoteList notes={data.notes} onDelete={(id) => deleteMutation.mutate(id)} />
    )}

    {isModalOpen && (
      <Modal onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>
    )}
  </div>
);
}
