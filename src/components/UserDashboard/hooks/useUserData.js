import { useState, useEffect } from 'react';

export const useUserData = () => {
  const [userData, setUserData] = useState({
    userName: 'User Name',
    userEmail: 'user@example.com',
    userId: ''
  });

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const userName = localStorage.getItem('userName') || 'Student';
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const userId = localStorage.getItem('userId') || '';

        setUserData({ userName, userEmail, userId });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return { userData };
};