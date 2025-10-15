import React from 'react';
import SearchFilter from '../Common/SearchFilter';
import BulkActions from '../Common/BulkActions';
import { filterContent } from '../../utils/helpers';

const ContentManagementSection = ({
  activeContentSection,
  setActiveContentSection,
  videos,
  notes,
  quizzes,
  courses,
  searchTerm,
  setSearchTerm,
  filterCourse,
  setFilterCourse,
  selectedItems,
  setSelectedItems,
  openVideoForm,
  openNoteForm,
  openQuizForm,
  openPreview,
  handleDeleteVideo,
  handleDeleteNote,
  handleDeleteQuiz,
  operationLoading
}) => {
  // Filter content based on search and course
  const filteredVideos = filterContent(videos, searchTerm, filterCourse);
  const filteredNotes = filterContent(notes, searchTerm, filterCourse);
  const filteredQuizzes = filterContent(quizzes, searchTerm, filterCourse);

  // Selection handlers
  const handleSelectItem = (itemId, type) => {
    setSelectedItems(prev => {
      const itemKey = `${type}_${itemId}`;
      if (prev.includes(itemKey)) {
        return prev.filter(id => id !== itemKey);
      } else {
        return [...prev, itemKey];
      }
    });
  };

  const handleSelectAll = (type, items) => {
    const allItemKeys = items.map(item => `${type}_${item._id}`);
    if (selectedItems.length === allItemKeys.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allItemKeys);
    }
  };

  const handleBulkDelete = async (type) => {
    const selectedCount = selectedItems.filter(item => item.startsWith(`${type}_`)).length;
    if (selectedCount === 0) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCount} ${type}(s)? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      const itemsToDelete = selectedItems.filter(item => item.startsWith(`${type}_`));
      
      for (const itemKey of itemsToDelete) {
        const itemId = itemKey.split('_')[1];
        if (type === 'video') await handleDeleteVideo(itemId);
        else if (type === 'note') await handleDeleteNote(itemId);
        else if (type === 'quiz') await handleDeleteQuiz(itemId);
      }
      
      setSelectedItems([]);
    } catch (error) {
      console.error(`Error deleting ${type}(s):`, error);
    }
  };

  // Render content based on active section
  const renderContentSection = () => {
    switch (activeContentSection) {
      case 'videos':
        return renderVideosSection();
      case 'notes':
        return renderNotesSection();
      case 'quizzes':
        return renderQuizzesSection();
      default:
        return renderVideosSection();
    }
  };

  const renderVideosSection = () => (
    <div className="content-section">
      <BulkActions
        type="video"
        selectedCount={selectedItems.filter(item => item.startsWith('video_')).length}
        onBulkDelete={() => handleBulkDelete('video')}
        onClearSelection={() => setSelectedItems([])}
      />
      
      <div className="content-header">
        <h3>Video Lectures ({filteredVideos.length})</h3>
        <button 
          className="btn-primary"
          onClick={() => openVideoForm()}
          disabled={operationLoading.video}
        >
          {operationLoading.video ? 'Uploading...' : '+ Upload Video'}
        </button>
      </div>

      {filteredVideos.length > 0 ? (
        <div className="content-grid">
          <div className="content-grid-header">
            <div className="content-checkbox-all">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredVideos.length && filteredVideos.length > 0}
                onChange={() => handleSelectAll('video', filteredVideos)}
                className="content-checkbox"
              />
              <span>Select All</span>
            </div>
            <span className="content-count">{filteredVideos.length} videos found</span>
          </div>
          
          {filteredVideos.map(video => (
            <div key={video._id} className="content-card">
              <div className="content-card-header">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(`video_${video._id}`)}
                  onChange={() => handleSelectItem(video._id, 'video')}
                  className="content-checkbox"
                />
                <div className="content-thumbnail">
                  <img 
                    src={video.thumbnail || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={video.title}
                  />
                  <div className="content-duration">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              <div className="content-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
                <div className="content-meta">
                  <span>Course: {courses.find(c => c._id === video.course)?.title || video.course}</span>
                  <span>Module: {video.module}</span>
                  <span>File: {video.fileName} ({video.fileSize} MB)</span>
                </div>
              </div>
              <div className="content-actions">
                <button 
                  className="btn-action preview"
                  onClick={() => openPreview(video, 'video')}
                >
                  👁️ Preview
                </button>
                <button 
                  className="btn-action edit"
                  onClick={() => openVideoForm(video)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-action delete"
                  onClick={() => handleDeleteVideo(video._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No Videos Found</h3>
          <p>{searchTerm || filterCourse ? 'Try adjusting your search or filters' : 'Start by uploading video lectures to your courses.'}</p>
          <button 
            className="btn-primary"
            onClick={() => openVideoForm()}
          >
            + Upload Your First Video
          </button>
        </div>
      )}
    </div>
  );

  const renderNotesSection = () => (
    <div className="content-section">
      <BulkActions
        type="note"
        selectedCount={selectedItems.filter(item => item.startsWith('note_')).length}
        onBulkDelete={() => handleBulkDelete('note')}
        onClearSelection={() => setSelectedItems([])}
      />
      
      <div className="content-header">
        <h3>Study Documents ({filteredNotes.length})</h3>
        <button 
          className="btn-primary"
          onClick={() => openNoteForm()}
          disabled={operationLoading.note}
        >
          {operationLoading.note ? 'Uploading...' : '+ Upload Document'}
        </button>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="content-grid">
          <div className="content-grid-header">
            <div className="content-checkbox-all">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredNotes.length && filteredNotes.length > 0}
                onChange={() => handleSelectAll('note', filteredNotes)}
                className="content-checkbox"
              />
              <span>Select All</span>
            </div>
            <span className="content-count">{filteredNotes.length} notes found</span>
          </div>
          
          {filteredNotes.map(note => (
            <div key={note._id} className="content-card">
              <div className="content-card-header">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(`note_${note._id}`)}
                  onChange={() => handleSelectItem(note._id, 'note')}
                  className="content-checkbox"
                />
                <div className="content-icon">
                  {note.fileType === 'pdf' ? '📄' : '📝'}
                </div>
              </div>
              <div className="content-info">
                <h4>{note.title}</h4>
                <p>{note.description}</p>
                <div className="content-meta">
                  <span>Course: {courses.find(c => c._id === note.course)?.title || note.course}</span>
                  <span>Type: {note.fileType?.toUpperCase()}</span>
                  <span>File: {note.fileName} ({note.fileSize} KB)</span>
                  <span>Pages: {note.pages || 'N/A'}</span>
                </div>
              </div>
              <div className="content-actions">
                <button 
                  className="btn-action preview"
                  onClick={() => openPreview(note, 'note')}
                >
                  👁️ Preview
                </button>
                <button 
                  className="btn-action edit"
                  onClick={() => openNoteForm(note)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-action delete"
                  onClick={() => handleDeleteNote(note._id)}
                >
                  🗑️ Delete
                </button>
                <button 
                  className="btn-action download"
                  onClick={() => window.open(note.downloadUrl, '_blank')}
                >
                  ⬇️ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Documents Found</h3>
          <p>{searchTerm || filterCourse ? 'Try adjusting your search or filters' : 'Start by uploading study documents to your courses.'}</p>
          <button 
            className="btn-primary"
            onClick={() => openNoteForm()}
          >
            + Upload Your First Document
          </button>
        </div>
      )}
    </div>
  );

  const renderQuizzesSection = () => (
    <div className="content-section">
      <BulkActions
        type="quiz"
        selectedCount={selectedItems.filter(item => item.startsWith('quiz_')).length}
        onBulkDelete={() => handleBulkDelete('quiz')}
        onClearSelection={() => setSelectedItems([])}
      />
      
      <div className="content-header">
        <h3>Quizzes & Assessments ({filteredQuizzes.length})</h3>
        <button 
          className="btn-primary"
          onClick={() => openQuizForm()}
          disabled={operationLoading.quiz}
        >
          {operationLoading.quiz ? 'Adding...' : '+ Add Quiz'}
        </button>
      </div>

      {filteredQuizzes.length > 0 ? (
        <div className="content-grid">
          <div className="content-grid-header">
            <div className="content-checkbox-all">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredQuizzes.length && filteredQuizzes.length > 0}
                onChange={() => handleSelectAll('quiz', filteredQuizzes)}
                className="content-checkbox"
              />
              <span>Select All</span>
            </div>
            <span className="content-count">{filteredQuizzes.length} quizzes found</span>
          </div>
          
          {filteredQuizzes.map(quiz => (
            <div key={quiz._id} className="content-card">
              <div className="content-card-header">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(`quiz_${quiz._id}`)}
                  onChange={() => handleSelectItem(quiz._id, 'quiz')}
                  className="content-checkbox"
                />
                <div className="content-icon">
                  ❓
                </div>
              </div>
              <div className="content-info">
                <h4>{quiz.title}</h4>
                <p>{quiz.description}</p>
                <div className="content-meta">
                  <span>Course: {courses.find(c => c._id === quiz.course)?.title || quiz.course}</span>
                  <span>Questions: {quiz.questions?.length || 0}</span>
                  <span>Time: {quiz.timeLimit} min</span>
                  <span>Passing: {quiz.passingScore}%</span>
                </div>
              </div>
              <div className="content-actions">
                <button 
                  className="btn-action preview"
                  onClick={() => openPreview(quiz, 'quiz')}
                >
                  👁️ Preview
                </button>
                <button 
                  className="btn-action edit"
                  onClick={() => openQuizForm(quiz)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-action delete"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">❓</div>
          <h3>No Quizzes Found</h3>
          <p>{searchTerm || filterCourse ? 'Try adjusting your search or filters' : 'Start by adding quizzes to assess student learning.'}</p>
          <button 
            className="btn-primary"
            onClick={() => openQuizForm()}
          >
            + Add Your First Quiz
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="content-management-section">
      <div className="section-header">
        <h2>Content Management</h2>
        <div className="content-type-buttons">
          <button 
            className={`content-type-btn ${activeContentSection === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveContentSection('videos')}
          >
            🎬 Videos ({videos.length})
          </button>
          <button 
            className={`content-type-btn ${activeContentSection === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveContentSection('notes')}
          >
            📝 Documents ({notes.length})
          </button>
          <button 
            className={`content-type-btn ${activeContentSection === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveContentSection('quizzes')}
          >
            ❓ Quizzes ({quizzes.length})
          </button>
        </div>
      </div>

      <SearchFilter
        type={activeContentSection}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCourse={filterCourse}
        setFilterCourse={setFilterCourse}
        courses={courses}
      />

      {renderContentSection()}
    </div>
  );
};

export default ContentManagementSection;