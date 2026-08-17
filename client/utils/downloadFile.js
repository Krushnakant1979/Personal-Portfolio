export const handleFileDownload = async (e, url, filename = 'Krushnakant_Rutele_Resume.pdf') => {
  if (!url) return;
  e.preventDefault();
  
  try {
    // Attempt standard fetch to blob (works if CORS is allowed)
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.warn('Direct download failed due to CORS or network error. Opening in new tab instead.', error);
    // Fallback: Open in new tab, let browser handle the PDF
    window.open(url, '_blank');
  }
};
