import React from 'react';
import { validateQuizForm } from '../../utils/validation';

const QuizFormModal = ({
  editingItem,
  quizForm,
  setQuizForm,
  courses,
  operationLoading,
  handleAddQuiz,
  handleUpdateQuiz,
  onClose,
  addNotification
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateQuizForm(quizForm, addNotification)) return;
    
    const success = editingItem 
      ? await handleUpdateQuiz(editingItem._id, quizForm)
      : await handleAddQuiz(quizForm);
    
    if (success) {
      onClose();
    }
  };

  // Quiz question management functions
  const addQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          options: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ]
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (quizForm.questions.length <= 1) {
      addNotification('Quiz must have at least one question', 'error');
      return;
    }
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index, field, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex ? {
          ...q,
          options: q.options.map((opt, oIndex) => 
            oIndex === optionIndex ? { ...opt, [field]: value } : opt
          )
        } : q
      )
    }));
  };

  const setCorrectAnswer = (questionIndex, optionIndex) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex ? {
          ...q,
          options: q.options.map((opt, oIndex) => ({
            ...opt,
            isCorrect: oIndex === optionIndex
          }))
        } : q
      )
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Quiz' : 'Add New Quiz'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Quiz Title *</label>
            <input
              type="text"
              value={quizForm.title}
              onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
              required
              className="form-input"
              placeholder="Enter quiz title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={quizForm.description}
              onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
              className="form-textarea"
              placeholder="Enter quiz description"
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Course *</label>
              <select
                value={quizForm.course}
                onChange={(e) => setQuizForm({...quizForm, course: e.target.value})}
                required
                className="form-select"
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time Limit (minutes) *</label>
              <input
                type="number"
                value={quizForm.timeLimit}
                onChange={(e) => setQuizForm({...quizForm, timeLimit: e.target.value})}
                required
                className="form-input"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Passing Score (%) *</label>
              <input
                type="number"
                value={quizForm.passingScore}
                onChange={(e) => setQuizForm({...quizForm, passingScore: e.target.value})}
                required
                className="form-input"
                min="1"
                max="100"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="questions-section">
            <div className="section-header">
              <h4>Questions ({quizForm.questions.length})</h4>
              <button type="button" className="btn-secondary" onClick={addQuestion}>
                + Add Question
              </button>
            </div>

            {quizForm.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="question-card">
                <div className="question-header">
                  <h5>Question {questionIndex + 1}</h5>
                  {quizForm.questions.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger small"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Question Text *</label>
                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
                    required
                    className="form-input"
                    placeholder="Enter the question"
                  />
                </div>

                <div className="options-section">
                  <h6>Options * (Select one correct answer)</h6>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-row">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={option.isCorrect}
                        onChange={() => setCorrectAnswer(questionIndex, optionIndex)}
                        className="option-radio"
                      />
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                        required
                        className="form-input option-input"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <span className="correct-label">
                        {option.isCorrect ? '✓ Correct' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={operationLoading.quiz}>
              {operationLoading.quiz ? 'Saving...' : (editingItem ? 'Update Quiz' : 'Add Quiz')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizFormModal;