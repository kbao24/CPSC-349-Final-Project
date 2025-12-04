import React, { useState } from 'react';
import {
  readEntries,
  addEntry,
  updateEntry,
  removeEntry,
  type Entry,
  type UnsavedEntry,
} from './data';

type View = 'home' | 'entries' | 'entry-form' | 'login';


function App() {
  // Load entries from localStorage (like data.js)
  const [entries, setEntries] = useState<Entry[]>(() => readEntries());
  const [view, setView] = useState<View>('home');
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formURL, setFormURL] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Delete modal
  const [showModal, setShowModal] = useState(false);

  const isEditing = editingEntryId !== null;
  const formHeading = isEditing ? 'Edit Entry' : 'New Entry';

  function resetForm() {
    setFormTitle('');
    setFormURL('');
    setFormNotes('');
  }

  function startNewEntry() {
    resetForm();
    setEditingEntryId(null);
    setView('entry-form');
  }

  function startEdit(entry: Entry) {
    setEditingEntryId(entry.entryId);
    setFormTitle(entry.title);
    setFormURL(entry.photoUrl);
    setFormNotes(entry.notes);
    setView('entry-form');
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isEditing) {
      // NEW ENTRY
      const unsaved: UnsavedEntry = {
        title: formTitle,
        notes: formNotes,
        photoUrl: formURL,
      };
      const saved = addEntry(unsaved); // writes to localStorage
      setEntries((prev) => [saved, ...prev]); // unshift
    } else {
      // EDIT EXISTING ENTRY
      const updated: Entry = {
        entryId: editingEntryId!,
        title: formTitle,
        notes: formNotes,
        photoUrl: formURL,
      };
      updateEntry(updated);
      setEntries((prev) =>
        prev.map((e) => (e.entryId === updated.entryId ? updated : e))
      );
      setEditingEntryId(null);
    }

    resetForm();
    setView('entries');
  }

  function handleConfirmDelete() {
    if (editingEntryId === null) return;

    removeEntry(editingEntryId);
    setEntries((prev) =>
      prev.filter((entry) => entry.entryId !== editingEntryId)
    );
    setEditingEntryId(null);
    setShowModal(false);
    resetForm();
    setView('entries');
  }

  return (
    <>
      {/* HEADER */}
      <header className="header app-header">
  <div className="container">
    <div className="row">
      <div className="column-full app-header-inner">
        {/* Brand / Logo */}
        <div className="brand">
          <div className="brand-mark">CJ</div>
          <span className="brand-text">Code Journal</span>
        </div>

        {/* Nav buttons */}
        <nav className="main-nav">
          <button
            className={
              'nav-btn' + (view === 'home' ? ' nav-btn-active' : '')
            }
            onClick={() => {
              setView('home');
              setEditingEntryId(null);
            }}
          >
            Home
          </button>

          <button
            className={
              'nav-btn' + (view === 'entries' ? ' nav-btn-active' : '')
            }
            onClick={() => {
              setView('entries');
              setEditingEntryId(null);
            }}
          >
            Entries
          </button>

          <button
            className={
              'nav-btn nav-btn-outline' +
              (view === 'login' ? ' nav-btn-active-outline' : '')
            }
            onClick={() => {
              setView('login');
              setEditingEntryId(null);
            }}
          >
            Login
          </button>
        </nav>
      </div>
    </div>
  </div>
</header>


      <main>
        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="container" data-view="home">
            <div className="row">
              <div className="column-full">
                <h1>Welcome to Code Journal</h1>
                <p>
                  This is your personal space to record coding notes, ideas, and
                  experiments. Use the <strong>Entries</strong> tab to view your
                  journal or click <strong>NEW</strong> to add a fresh post.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ENTRY FORM VIEW */}
        <div
          className={view === 'entry-form' ? 'container' : 'container hidden'}
          data-view="entry-form"
        >
          <div className="row">
            <div className="column-full d-flex justify-between">
              <h1 id="formH1">{formHeading}</h1>
            </div>
          </div>

          <form id="entryForm" onSubmit={handleSubmit}>
            <div className="row margin-bottom-1">
              <div className="column-half">
                <img
                  className="input-b-radius form-image"
                  id="formImage"
                  src={
                    formURL
                      ? formURL
                      : 'images/placeholder-image-square.jpg'
                  }
                  alt="image of entry"
                />
              </div>
              <div className="column-half">
                <label
                  className="margin-bottom-1 d-block"
                  htmlFor="formTitle"
                >
                  Title
                </label>
                <input
                  required
                  className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                  type="text"
                  id="formTitle"
                  name="formTitle"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
                <label
                  className="margin-bottom-1 d-block"
                  htmlFor="formURL"
                >
                  Photo URL
                </label>
                <input
                  required
                  className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                  type="text"
                  id="formURL"
                  name="formURL"
                  value={formURL}
                  onChange={(e) => setFormURL(e.target.value)}
                />
              </div>
            </div>

            <div className="row margin-bottom-1">
              <div className="column-full">
                <label
                  className="margin-bottom-1 d-block"
                  htmlFor="formNotes"
                >
                  Notes
                </label>
                <textarea
                  required
                  className="input-b-color text-padding input-b-radius purple-outline d-block width-100"
                  name="formNotes"
                  id="formNotes"
                  rows={10}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="row">
              <div className="column-full d-flex justify-between">
                <button
                  className={
                    'delete-entry-button' + (isEditing ? '' : ' invisible')
                  }
                  type="button"
                  id="deleteEntry"
                  onClick={() => setShowModal(true)}
                >
                  Delete Entry
                </button>
                <button className="input-b-radius text-padding purple-background white-text">
                  SAVE
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ENTRIES VIEW */}
        <div
          className={view === 'entries' ? 'container' : 'container hidden'}
          data-view="entries"
        >
          <div className="row">
            <div className="column-full d-flex justify-between align-center entry-title-row">
              <h1>Entries</h1>
              {/* Purple NEW button like original */}
              <button onClick={() => startNewEntry()} className="new-button">
                NEW
              </button>

            </div>
          </div>

          <div className="row">
            <div className="column-full">
              {entries.length === 0 ? (
                <p>No entries yet.</p>
              ) : (
                <ul className="entry-ul" id="entryUl">
                  {entries.map((entry) => (
                    <li key={entry.entryId}>
                      <div className="row">
                        <div className="column-half entry-text">
                          <img
                            className="input-b-radius form-image"
                            src={entry.photoUrl}
                            alt={entry.title}
                          />
                        </div>

                        <div className="column-half">
                          <div className="row">
                            <div className="d-flex justify-between align-center entry-title-row">
                              <h3 className="entry-title">{entry.title}</h3>
                              <i
                                className="fa-solid fa-pencil"
                                onClick={() => startEdit(entry)}
                              ></i>

                            </div>
                          </div>

                          <p className="entry-notes">{entry.notes}</p>
                        </div>
                      </div>
                    </li>

                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* DELETE MODAL */}
      <article>
        <div
          id="modalContainer"
          className={
            'modal-container d-flex justify-center align-center' +
            (showModal ? '' : ' hidden')
          }
        >
          <div className="modal row">
            <div className="column-full d-flex justify-center">
              <p>Are you sure you want to delete this entry?</p>
            </div>
            <div className="column-full d-flex justify-between">
              <button
                className="modal-button"
                id="cancelButton"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button red-background white-text"
                id="confirmButton"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default App;
