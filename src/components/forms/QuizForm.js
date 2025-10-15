import React, { useState } from 'react';
import './QuizForm.css';

const QuizForm = ({
  editingItem,
  quizForm,
  setQuizForm,
  onSubmit,
  onClose,
  courses,
  operationLoading,
  addNotification
}) => {
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setQuizForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle question text change
  const handleQuestionChange = (questionIndex, value) => {
    const updatedQuestions = [...quizForm.questions];
    updatedQuestions[questionIndex].questionText = value;
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  // Handle option change
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...quizForm.questions];
    
    if (field === 'isCorrect') {
      // Set only one option as correct - uncheck all others
      updatedQuestions[questionIndex].options.forEach((option, index) => {
        option.isCorrect = index === optionIndex;
      });
    } else {
      updatedQuestions[questionIndex].options[optionIndex][field] = value;
    }
    
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  // Add new question
  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    };
    
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    // Set the new question as active
    setActiveQuestion(quizForm.questions.length);
  };

  // Remove question
  const removeQuestion = (index) => {
    if (quizForm.questions.length <= 1) {
      addNotification('Quiz must have at least one question', 'warning');
      return;
    }

    const updatedQuestions = quizForm.questions.filter((_, i) => i !== index);
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }));

    // Adjust active question index
    if (activeQuestion >= index) {
      setActiveQuestion(Math.max(0, activeQuestion - 1));
    }
  };

  // Add option to a question
  const addOption = (questionIndex) => {
    const updatedQuestions = [...quizForm.questions];
    if (updatedQuestions[questionIndex].options.length < 6) {
      updatedQuestions[questionIndex].options.push({
        optionText: '',
        isCorrect: false
      });
      setQuizForm(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    } else {
      addNotification('Maximum 6 options allowed per question', 'warning');
    }
  };

  // Remove option from a question
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizForm.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuizForm(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    } else {
      addNotification('Each question must have at least 2 options', 'warning');
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!quizForm.title.trim()) {
      addNotification('Quiz title is required', 'error');
      return false;
    }

    if (!quizForm.course) {
      addNotification('Please select a course', 'error');
      return false;
    }

    if (quizForm.questions.length === 0) {
      addNotification('Quiz must have at least one question', 'error');
      return false;
    }

    for (let i = 0; i < quizForm.questions.length; i++) {
      const question = quizForm.questions[i];
      
      if (!question.questionText.trim()) {
        addNotification(`Question ${i + 1} text is required`, 'error');
        setActiveQuestion(i);
        return false;
      }

      // Check if at least 2 options have text
      const validOptions = question.options.filter(opt => opt.optionText.trim());
      if (validOptions.length < 2) {
        addNotification(`Question ${i + 1} must have at least 2 options`, 'error');
        setActiveQuestion(i);
        return false;
      }

      // Check if one option is marked as correct
      const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        addNotification(`Question ${i + 1} must have one correct answer`, 'error');
        setActiveQuestion(i);
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(e);
  };

  // Question navigation
  const nextQuestion = () => {
    if (activeQuestion < quizForm.questions.length - 1) {
      setActiveQuestion(activeQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (activeQuestion > 0) {
      setActiveQuestion(activeQuestion - 1);
    }
  };

  return (
    <div className="quiz-form">
      <div className="form-header">
        <h2>{editingItem ? 'Edit Quiz' : 'Create New Quiz'}</h2>
        <p>Design your quiz with questions and multiple choice options</p>
      </div>

      <form onSubmit={handleSubmit} className="quiz-form-content">
        {/* Basic Quiz Info */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Quiz Title *</label>
              <input
                type="text"
                value={quizForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="form-group">
              <label>Course *</label>
              <select
                value={quizForm.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={quizForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter quiz description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                value={quizForm.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 30)}
                min="1"
                max="180"
              />
            </div>

            <div className="form-group">
              <label>Passing Score (%)</label>
              <input
                type="number"
                value={quizForm.passingScore}
                onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value) || 70)}
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="form-section">
          <div className="section-header">
            <h3>Questions ({quizForm.questions.length})</h3>
            <button
              type="button"
              className="btn-primary btn-small"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>

          {quizForm.questions.length > 0 && (
            <div className="questions-navigation">
              {quizForm.questions.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`nav-dot ${activeQuestion === index ? 'active' : ''} ${
                    !quizForm.questions[index].questionText.trim() ? 'invalid' : ''
                  }`}
                  onClick={() => setActiveQuestion(index)}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {quizForm.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className={`question-container ${activeQuestion === questionIndex ? 'active' : 'hidden'}`}
            >
              <div className="question-header">
                <h4>Question {questionIndex + 1}</h4>
                {quizForm.questions.length > 1 && (
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    Remove Question
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                  placeholder="Enter your question here..."
                  rows="3"
                  required
                />
              </div>

              <div className="options-section">
                <div className="options-header">
                  <label>Options *</label>
                  <button
                    type="button"
                    className="btn-secondary btn-small"
                    onClick={() => addOption(questionIndex)}
                    disabled={question.options.length >= 6}
                  >
                    + Add Option
                  </button>
                </div>

                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-row">
                    <div className="option-input-group">
                      <input
                        type="radio"
                        name={`correct-answer-${questionIndex}`}
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                        className="correct-radio"
                      />
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'optionText', e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="option-text-input"
                      />
                    </div>
                    
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        className="btn-remove-option"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        title="Remove option"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <div className="option-hint">
                  <span className="hint-icon">💡</span>
                  Click the radio button to mark the correct answer
                </div>
              </div>

              {/* Question Navigation */}
              {quizForm.questions.length > 1 && (
                <div className="question-nav-buttons">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={prevQuestion}
                    disabled={activeQuestion === 0}
                  >
                    ← Previous
                  </button>
                  
                  <span className="question-counter">
                    Question {activeQuestion + 1} of {quizForm.questions.length}
                  </span>
                  
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={nextQuestion}
                    disabled={activeQuestion === quizForm.questions.length - 1}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          ))}

          {quizForm.questions.length === 0 && (
            <div className="empty-questions">
              <div className="empty-icon">❓</div>
              <h4>No Questions Added</h4>
              <p>Start by adding your first question to create the quiz.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={addQuestion}
              >
                Add First Question
              </button>
            </div>
          )}
        </div>

        {/* Quiz Summary */}
        {quizForm.questions.length > 0 && (
          <div className="quiz-summary">
            <h4>Quiz Summary</h4>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Questions:</span>
                <span className="stat-value">{quizForm.questions.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time Limit:</span>
                <span className="stat-value">{quizForm.timeLimit} minutes</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Passing Score:</span>
                <span className="stat-value">{quizForm.passingScore}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Estimated Duration:</span>
                <span className="stat-value">
                  {Math.ceil(quizForm.questions.length * 2)} minutes
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={operationLoading}
          >
            Cancel
          </button>
          
          <div className="action-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={addQuestion}
              disabled={operationLoading}
            >
              Add Another Question
            </button>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={operationLoading}
            >
              {operationLoading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  {editingItem ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingItem ? 'Update Quiz' : 'Create Quiz'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;