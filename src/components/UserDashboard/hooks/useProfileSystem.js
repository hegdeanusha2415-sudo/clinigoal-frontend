import { useState, useEffect } from 'react';

export const useProfileSystem = () => {
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Image compression helper function
  const compressImage = (src, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = (error) => reject(error);
    });
  };

  // Load profile photo on component mount
  useEffect(() => {
    const savedProfilePhoto = sessionStorage.getItem('userProfilePhoto') || 
                            localStorage.getItem('userProfilePhoto');
    if (savedProfilePhoto) {
      setProfilePhoto(savedProfilePhoto);
    }
    setLoading(false);
  }, []);

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB. Please choose a smaller image.');
        return;
      }
      
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      setIsUploading(true);
      
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const originalDataUrl = event.target.result;
            const compressedDataUrl = await compressImage(originalDataUrl, 200, 200, 0.7);
            
            const compressedSize = Math.round(compressedDataUrl.length * 3/4);
            if (compressedSize > 500 * 1024) {
              alert('Compressed image is still too large. Please choose a smaller image.');
              setIsUploading(false);
              return;
            }
            
            setProfilePhoto(compressedDataUrl);
            
            try {
              sessionStorage.setItem('userProfilePhoto', compressedDataUrl);
            } catch (sessionStorageError) {
              console.error('Session storage error:', sessionStorageError);
              try {
                localStorage.setItem('userProfilePhoto', compressedDataUrl);
              } catch (localStorageError) {
                console.error('Local storage error:', localStorageError);
                alert('Unable to save profile photo to browser storage. The photo will only be available during this session.');
              }
            }
          } catch (error) {
            console.error('Image processing error:', error);
            alert('Error processing image. Please try a different image.');
          } finally {
            setIsUploading(false);
          }
        };
        
        reader.onerror = () => {
          setIsUploading(false);
          alert('Error reading file. Please try again.');
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        setIsUploading(false);
        console.error('Upload error:', error);
        alert('Error uploading image. Please try again.');
      }
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto('');
    try {
      sessionStorage.removeItem('userProfilePhoto');
      localStorage.removeItem('userProfilePhoto');
    } catch (error) {
      console.error('Error removing photo from storage:', error);
    }
  };

  return {
    profilePhoto,
    isUploading,
    loading,
    handleProfilePhotoUpload,
    handleRemovePhoto
  };
};