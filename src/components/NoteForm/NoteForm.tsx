import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteForm.module.css';
import { createNote, type CreateNotePayload } from '../../services/noteService'; // Ensure createNote is imported from your service

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title cannot exceed 50 characters')
    .required('Title is a required field'),
  content: Yup.string()
    .max(500, 'Content cannot exceed 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag selection')
    .required('Tag is a required field'),
});

const initialValues: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });

  const handleSubmit = (values: CreateNotePayload) => {
    mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor='title'>Title</label>
          <Field id='title' type='text' name='title' className={css.input} />
          <ErrorMessage name='title' component='span' className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor='content'>Content</label>
          <Field id='content' name='content' as='textarea' rows={8} className={css.textarea} />
          <ErrorMessage name='content' component='span' className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor='tag'>Tag</label>
          <Field id='tag' name='tag' as='select' className={css.select}>
            <option value='Todo'>Todo</option>
            <option value='Work'>Work</option>
            <option value='Personal'>Personal</option>
            <option value='Meeting'>Meeting</option>
            <option value='Shopping'>Shopping</option>
          </Field>
          <ErrorMessage name='tag' component='span' className={css.error} />
        </div>

        <div className={css.actions}>
          <button type='button' className={css.cancelButton} onClick={onCancel} disabled={isPending}>
            Cancel
          </button>
          <button type='submit' className={css.submitButton} disabled={isPending}>
            {isPending ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
