export const getFileBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const getVideoThumbnail = (file: File, time: number = 1): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.currentTime = time;
    
    // Some browsers need this to actually load the frame
    video.muted = true;
    video.playsInline = true;

    const onSeeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      } else {
        resolve('');
      }
      video.removeEventListener('seeked', onSeeked);
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', () => resolve(''));
    
    // Trigger loadeddata to seek
    video.addEventListener('loadeddata', () => {
      if (video.duration >= time) {
        video.currentTime = time;
      } else {
        video.currentTime = 0;
      }
    });
  });
};
