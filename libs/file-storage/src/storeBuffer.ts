import { Readable } from 'stream';
import { Storage } from '@google-cloud/storage';

export async function storeBuffer(
  buffer: Buffer,
  bucketName: string,
  filename: string
): Promise<void> {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);

  return new Promise<void>((resolve, reject) => {
    readable
      .pipe(file.createWriteStream())
      .on('error', reject)
      .on('finish', resolve);
  });
}
