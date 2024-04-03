import { useState } from 'react';
import { Callback } from '@/types/others/callback';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/configs/firebase';

export const useUploadFirebase = (): [
  boolean,
  string | undefined,
  (file: File, cb?: Callback) => void
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<string>();

  const handleUploadImageOnFirebase = async (file: File, cb?: Callback) => {
    setIsLoading(true);

    const imageRef = ref(storage, `images/${file.name} + ${uuidv4()}`);
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setUrl(downloadUrl);
      cb?.onSuccess?.(downloadUrl);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return [isLoading, url, handleUploadImageOnFirebase];
};
