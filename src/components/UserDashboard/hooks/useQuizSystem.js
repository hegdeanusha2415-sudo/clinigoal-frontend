import { useState, useEffect } from 'react';

export const useQuizSystem = (activeQuiz, setActiveQuiz, selectedCourse, enrolledCourses) => {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [quizTimer, setQuizTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState({});
  const [questionTimes, setQuestionTimes] = useState({});
  
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [completedNotes, setCompletedNotes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  // Load completed items on mount
  useEffect(() => {
    const savedWatchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    setWatchedVideos(savedWatchedVideos);
    
    const savedCompletedNotes = JSON.parse(localStorage.getItem('completedNotes') || '[]');
    setCompletedNotes(savedCompletedNotes);
    
    const savedCompletedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
    setCompletedQuizzes(savedCompletedQuizzes);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start quiz function
  const startQuiz = async (quiz) => {
    try {
      console.log("🚀 Starting quiz:", quiz.title);
      
      const quizWithProperIds = {
        ...quiz,
        questions: quiz.questions?.map((question, qIndex) => ({
          ...question,
          _id: question._id || `q${qIndex}`,
          options: question.options?.map((option, oIndex) => ({
            ...option,
            id: option.id || `q${qIndex}_opt${oIndex}`
          }))
        })) || []
      };
      
      setActiveQuiz(quizWithProperIds);
      setQuizAnswers({});
      setQuizResults(null);
      
      setQuizTimer(0);
      setQuestionStartTime({});
      setQuestionTimes({});
      
      const interval = setInterval(() => {
        setQuizTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to start quiz. Please try again.');
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    console.log("📝 Answer selected:", { questionId, optionId });
    
    if (questionStartTime[questionId]) {
      const timeSpent = Math.floor(Date.now() / 1000) - questionStartTime[questionId];
      setQuestionTimes(prev => ({
        ...prev,
        [questionId]: timeSpent
      }));
    }
    
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    
    setQuestionStartTime(prev => ({
      ...prev,
      [questionId]: Math.floor(Date.now() / 1000)
    }));
  };

  // Submit quiz function
  const submitQuiz = async () => {
    if (!activeQuiz) return;

    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    try {
      let correctAnswers = 0;
      let totalQuestions = activeQuiz.questions.length;

      const detailedResults = activeQuiz.questions.map((question, questionIndex) => {
        const questionId = question._id || `q${questionIndex}`;
        const selectedOptionId = quizAnswers[questionId];
        
        const selectedOption = question.options.find(opt => 
          opt.id === selectedOptionId || opt._id === selectedOptionId
        );
        
        const correctOption = question.options.find(opt => opt.isCorrect === true);
        const isCorrect = selectedOption && selectedOption.isCorrect === true;
        
        if (isCorrect) {
          correctAnswers++;
        }
        
        return {
          questionId,
          questionText: question.questionText,
          selectedOption: selectedOption ? selectedOption.optionText : 'Not answered',
          correctOption: correctOption ? correctOption.optionText : 'No correct answer specified',
          isCorrect,
          timeSpent: questionTimes[questionId] || 0
        };
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = score >= (activeQuiz.passingScore || 70);
      const formattedTime = formatTime(quizTimer);

      const results = {
        score,
        passed,
        totalQuestions,
        correctAnswers,
        timeSpent: formattedTime,
        timeInSeconds: quizTimer,
        detailedResults
      };

      console.log("📊 Quiz results:", results);

      if (passed && activeQuiz._id && !completedQuizzes.includes(activeQuiz._id)) {
        setCompletedQuizzes(prev => [...prev, activeQuiz._id]);
        const savedCompletedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
        localStorage.setItem('completedQuizzes', JSON.stringify([...savedCompletedQuizzes, activeQuiz._id]));
      }

      setQuizResults(results);

    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  // Reset quiz function
  const resetQuiz = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setQuizTimer(0);
    setActiveQuiz(null);
    setQuizAnswers({});
    setQuizResults(null);
    setQuestionStartTime({});
    setQuestionTimes({});
  };

  // Mark video as watched
  const handleWatchVideo = async (video) => {
    try {
      if (!watchedVideos.includes(video._id)) {
        setWatchedVideos(prev => [...prev, video._id]);
        const savedWatchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
        localStorage.setItem('watchedVideos', JSON.stringify([...savedWatchedVideos, video._id]));
      }
    } catch (error) {
      console.error('Error marking video as watched:', error);
    }
  };

  // Mark note as completed
  const handleCompleteNote = (noteId) => {
    if (!completedNotes.includes(noteId)) {
      setCompletedNotes(prev => [...prev, noteId]);
      const savedCompletedNotes = JSON.parse(localStorage.getItem('completedNotes') || '[]');
      localStorage.setItem('completedNotes', JSON.stringify([...savedCompletedNotes, noteId]));
    }
  };

  return {
    quizAnswers,
    quizResults,
    quizTimer,
    startQuiz,
    handleAnswerSelect,
    submitQuiz,
    resetQuiz,
    watchedVideos,
    completedNotes,
    completedQuizzes,
    handleWatchVideo,
    handleCompleteNote,
    formatTime
  };
};