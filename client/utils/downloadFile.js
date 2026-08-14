export const handleFileDownload = async (e, url, filename = 'Resume.pdf') => {
  if (!url) return;
  
  if (url.includes('cloudinary')) {
    e.preventDefault();
    try {
      // Fetch the file as a blob to force download
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed, opening in new tab instead:', error);
      window.open(url, '_blank'); // Fallback to opening in new tab
    }
  }
};
