import { put } from '@vercel/blob';

export default async function handler(req, res) {
  const BLOB_URL = 'https://store_Mv6UwIe2SfRVNOOX.public.blob.vercel-storage.com/respects.json';

  if (req.method === 'GET') {
    try {
      const response = await fetch(BLOB_URL, { cache: 'no-store' });
      if (!response.ok) return res.status(200).json({ count: 0 });
      
      const data = await response.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(200).json({ count: 0 });
    }
  }

  if (req.method === 'POST') {
    try {
      let currentCount = 0;

      try {
        const response = await fetch(BLOB_URL, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          currentCount = data.count || 0;
        }
      } catch (e) {
        // fallback
      }

      const newCount = currentCount + 1;
      await put('respects.json', JSON.stringify({ count: newCount }), {
        access: 'private',
        addRandomSuffix: false, 
        allowOverwrite: true,
        contentType: 'application/json'
      });

      return res.status(200).json({ count: newCount });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).end();
}
