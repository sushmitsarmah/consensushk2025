/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import pinata from '@/web3/services/ipfs/pinata'; // Adjust the path as necessary
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setError(null); // Clear any previous error
      } else {
        setError('Please select an image file.');
        setFile(null); // Clear the file if it's not an image
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await pinata.upload.file(file);
      setSuccess(`File uploaded successfully: ${result.IpfsHash}`);
    } catch (err: any) {
      setError(`Error uploading file: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default ImageUploader;