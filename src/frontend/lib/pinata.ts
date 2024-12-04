import axios from 'axios';

// Pinata API URLs and Keys
const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_API_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

// Function to fetch pinned files from Pinata
export const fetchPinnedFiles = async () => {
  if (!PINATA_API_KEY || !PINATA_API_SECRET_KEY) {
    throw new Error('Pinata API keys are missing.');
  }

  try {
    const response = await axios.get('https://api.pinata.cloud/data/pinList', {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET_KEY,
      },
      params: {
        status: 'pinned',
        perPage: 50,
        page: 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pinned files:', error);
    throw new Error('Failed to fetch pinned files from Pinata.');
  }
};

// Function to upload a file to IPFS using Pinata
export const pinFileToIPFS = async (file: File) => {
  if (!PINATA_API_KEY || !PINATA_API_SECRET_KEY) {
    throw new Error('Pinata API keys are missing.');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(PINATA_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET_KEY,
      },
    });

    // Return the IPFS hash and URL of the uploaded file
    const ipfsHash = response.data.IpfsHash;
    return {
      IpfsHash: ipfsHash,
      IpfsUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS via Pinata.');
  }
};
