
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
  const [entries, setEntries] = useState<Entry[]>(() => readEntries());
  const [view, setView] = useState<View>('home');
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formURL, setFormURL] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [isDragging, setIsDragging] = useState(false);


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
      const unsaved: UnsavedEntry = {
        title: formTitle,
        notes: formNotes,
        photoUrl: formURL,
      };
      const saved = addEntry(unsaved); 
      setEntries((prev) => [saved, ...prev]); 
    } else {
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

  const heroSlides = [
    {
      title: 'Capture your coding thoughts',
      text: 'Log bugs, breakthroughs, and notes before you forget them.',
      imageUrl: 'stock-image-all-one-place.jpg',
    },
    {
      title: 'Stay organized over time',
      text: 'Scroll back through your entries to see how your skills grow.',
      imageUrl: 'organized.jpg',
    },
    {
      title: 'All your entries in one place',
      text: 'Create, read, update, and delete blog-style posts in seconds.',
      imageUrl: 'image.png',
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  function nextSlide() {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  }

  function prevSlide() {
    setHeroIndex((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  }

  function handleImageDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setFormURL(result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }



  return (
    <div className={darkMode ? 'app app-dark' : 'app'}>
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

                {/* Dark mode toggle */}
                <button
                  className="nav-btn nav-btn-outline"
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                >
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </button>
              </nav>

            </div>
          </div>
        </div>
      </header>


      <main>
        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="container home-container" data-view="home">
            {/* HERO SECTION */}
            <section className="home-hero row">
              {/* Left side: hero text */}
              <div className="column-half hero-left">
                <p className="hero-kicker">Welcome to Code Journal</p>
                <h1 className="hero-title">
                  A simple place to track your coding ideas, experiments, and progress.
                </h1>
                <p className="hero-subtitle">
                  Create blog-style entries for bugs you solved, concepts you learned,
                  or projects you&apos;re building. Come back later to review and refine.
                </p>
                <div className="hero-actions">
                  <button
                    className="hero-btn hero-btn-primary"
                    onClick={() => {
                      setEditingEntryId(null);
                      resetForm();
                      setView('entry-form');
                    }}
                  >
                    Start a new entry
                  </button>
                  <button
                    className="hero-btn hero-btn-secondary"
                    onClick={() => setView('entries')}
                  >
                    View your entries
                  </button>
                </div>
              </div>

              {/* Right side: simple image carousel */}
              <div className="column-half hero-right">
                <div className="hero-carousel">
                  <div className="hero-slide">
                    <img
                      src={heroSlides[heroIndex].imageUrl}
                      alt={heroSlides[heroIndex].title}
                      className="hero-slide-image"
                    />
                    <div className="hero-slide-caption">
                      <h3>{heroSlides[heroIndex].title}</h3>
                      <p>{heroSlides[heroIndex].text}</p>
                    </div>
                  </div>

                  <div className="hero-carousel-controls">
                    <button
                      type="button"
                      className="hero-carousel-btn"
                      onClick={prevSlide}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="hero-carousel-btn"
                      onClick={nextSlide}
                    >
                      ›
                    </button>
                  </div>

                  <div className="hero-dots">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={
                          'hero-dot' + (index === heroIndex ? ' hero-dot-active' : '')
                        }
                        onClick={() => setHeroIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="features-section">
              <h2 className="features-title">What you can do</h2>
              <p className="features-subtitle">
                Code Journal is built around a simple, powerful set of features:
              </p>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </div>
                  <h3 className="feature-heading">Create entries</h3>
                  <p className="feature-text">
                    Quickly add new blog-style posts with a title, image, and notes
                    about what you learned or built.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fa-solid fa-book-open"></i>
                  </div>
                  <h3 className="feature-heading">Read your journal</h3>
                  <p className="feature-text">
                    Browse your previous entries in a clean, card-based layout to
                    revisit old ideas and patterns.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fa-solid fa-rotate"></i>
                  </div>
                  <h3 className="feature-heading">Update posts</h3>
                  <p className="feature-text">
                    Edit any entry when you learn a better approach or want to add more
                    context to your notes.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon feature-icon-danger">
                    <i className="fa-solid fa-trash"></i>
                  </div>
                  <h3 className="feature-heading">Delete entries</h3>
                  <p className="feature-text">
                    Clean up your journal by removing entries that you no longer need,
                    with a safety confirmation step.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
        {/* LOGIN VIEW */}
        {view === 'login' && (
          <div className="login-page" data-view="login">
            <div className="login-card">
              <h2 className="login-title">Sign in to Code Journal</h2>
              <p className="login-subtitle">
                Welcome back! Please sign in to continue.
              </p>

              {/* Google button – UI only */}
              <button
                type="button"
                className="login-google-btn"
                onClick={() => {
                  // For now just pretend login succeeded:
                  setView('entries');
                }}
              >
                <span className="login-google-icon">G</span>
                <span>Continue with Google</span>
              </button>

              <div className="login-divider">
                <span>or</span>
              </div>

              <div className="login-field">
                <label htmlFor="loginEmail">Email address</label>
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="you@example.com"
                  className="login-input"
                />
              </div>

              <button
                type="button"
                className="login-submit-btn"
                onClick={() => setView('entries')}
              >
                Continue
              </button>

              <p className="login-footer">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="login-link"
                  onClick={() => setView('entry-form')}
                >
                  Sign up
                </button>
              </p>
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
                <div
                  className={
                    'dropzone' + (isDragging ? ' dropzone-dragging' : '')
                  }
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleImageDrop}
                >
                  <p className="dropzone-text">
                    Drag &amp; drop an image here,
                    <br />
                    or paste a URL in the field.
                  </p>
                  <img
                    className="dropzone-image"
                    id="formImage"
                    src={
                      formURL
                        ? formURL
                        : '/images/placeholder-image-square.jpeg'
                    }
                    alt="image of entry"
                  />
                </div>
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
                <button className="save-button">
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
              <h1>Your Entries</h1>
              {/* New Entry Button */}
              <button onClick={() => startNewEntry()} className="new-button">
                New Entry
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
                    <li key={entry.entryId} className="entry-card">
                      <img
                        className="entry-card-image"
                        src={entry.photoUrl}
                        alt={entry.title}
                      />

                      <div className="entry-card-body">
                        <div className="entry-card-header">
                          <h3 className="entry-title">{entry.title}</h3>
                          <i
                            className="fa-solid fa-pencil"
                            onClick={() => startEdit(entry)}
                          ></i>
                        </div>

                        <p className="entry-notes">{entry.notes}</p>
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
            'modal-container' + (showModal ? '' : ' hidden')
          }
        >
          <div className="modal-card">
            <p className="modal-text">
              Are you sure you want to delete this entry?
            </p>
            <div className="modal-actions">
              <button
                className="modal-button modal-button-secondary"
                id="cancelButton"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-danger"
                id="confirmButton"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default App;
