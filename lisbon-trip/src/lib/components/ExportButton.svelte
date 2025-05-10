<script lang="ts">
  import JSZip from 'jszip';
  import pkg from 'file-saver';
  const { saveAs } = pkg;

  const files = [
    'flights.json',
    'stays.json',
    'explore.json',
    'eat.json'
  ];

  async function handleExport() {
    const zip = new JSZip();
    
    // Fetch and add each file to the zip
    await Promise.all(files.map(async (filename) => {
      try {
        const response = await fetch(`/data/${filename}`);
        const data = await response.text();
        zip.file(filename, data);
      } catch (error) {
        console.error(`Failed to fetch ${filename}:`, error);
      }
    }));

    // Generate and download the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'lisbon-trip-data.zip');
  }
</script>

<button 
  on:click={handleExport}
  class="w-full mt-6 btn-primary"
>
  <div class="flex items-center justify-center gap-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Export Trip Data
  </div>
</button> 