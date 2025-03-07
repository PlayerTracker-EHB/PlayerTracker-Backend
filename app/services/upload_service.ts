import drive from '@adonisjs/drive/services/main'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import { promisify } from 'node:util'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { MinioService } from './minio_service.js'
import { inject } from '@adonisjs/core'

const unlink = promisify(fs.unlink)

@inject()
export class UploadService {

  constructor(
    protected minioService: MinioService
  ) { }

  private getTempChunkPath(filename: string, chunkIndex: number) {
    return app.makePath('tmp/chunks', `${filename}_${chunkIndex}`)
  }

  private ensureChunkDirectory() {
    const chunksDir = app.makePath('tmp/chunks')
    if (!fs.existsSync(chunksDir)) {
      fs.mkdirSync(chunksDir, { recursive: true })
    }
    return chunksDir
  }

  async handleChunkUpload(chunk: MultipartFile, name: string, chunkIndex: number) {
    const chunksDir = this.ensureChunkDirectory();

    try {
      // Attempt to move the chunk to the designated directory
      await chunk.move(chunksDir, {
        name: `${name}_${chunkIndex}`,
        overwrite: true
      });

      return true;
    } catch (error) {
      // Log the error details
      console.error(`Failed to upload chunk ${name}_${chunkIndex}:`, error);

      // Optionally, you can throw a specific error or return a failure response
      throw new Error(`Chunk upload failed for ${name}_${chunkIndex}: ${error.message}`);
    }
  }

  async combineAndStoreFile(filename: string, totalChunks: number) {
    const finalFilePath = app.makePath('tmp', `complete_${filename}`);
    const writeStream = fs.createWriteStream(finalFilePath);

    try {
      // Combine chunks
      await this.combineChunks(filename, totalChunks, writeStream);
      console.log(`All chunks combined successfully into: ${finalFilePath}`);

      // Upload to storage
      const array = await this.uploadFinalFile(filename, finalFilePath);

      // Cleanup
      await this.cleanup(finalFilePath);
      console.log(`Temporary file cleaned up: ${finalFilePath}`);

      return array;
    } catch (error) {
      console.error("Error during file combination or upload:", error);
      // Ensure cleanup on error
      if (fs.existsSync(finalFilePath)) {
        await unlink(finalFilePath);
        console.log(`Cleaned up final file due to error: ${finalFilePath}`);
      }
      throw error;
    }
  }

  private async combineChunks(filename: string, totalChunks: number, writeStream: fs.WriteStream) {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = this.getTempChunkPath(filename, i);

      const chunkContent = await fs.promises.readFile(chunkPath);

      await new Promise((resolve, reject) => {
        writeStream.write(chunkContent, (error) => {
          if (error) {
            console.error(`Error writing chunk ${i} to final file:`, error);
            reject(error);
          } else {
            resolve(true);
          }
        });
      });

      // Delete chunk after combining
      await unlink(chunkPath);
    }

    writeStream.end();
    console.log("Finished writing all chunks to final file.");
  }

  private sanitizeFilename(filename: string): string {
    const sanitized = filename.replace(/[^A-Za-z0-9\-_\/\!\.]/g, '-').replace(/\s+/g, '');
    //add timestamp at the beginning
    const timestamp = Date.now().toString();
    const sanitizedWithTimestamp = timestamp + sanitized;
    return sanitizedWithTimestamp;
  }

  private async uploadFinalFile(filename: string, finalFilePath: string) {
    const finalFileContent = await fs.promises.readFile(finalFilePath);
    const disk = drive.use('fs');

    // Sanitize the filename before uploading
    const sanitizedFilename = this.sanitizeFilename(filename);
    console.log(`Sanitized filename: ${sanitizedFilename}`);

    await disk.put(`videos/${sanitizedFilename}`, finalFileContent, {
      contentType: 'video/mp4',
    });

    const url = await drive.use().getUrl(`videos/${sanitizedFilename}`);


    return [url, sanitizedFilename];
  }

  private async cleanup(finalFilePath: string) {
    if (fs.existsSync(finalFilePath)) {
      await unlink(finalFilePath);
      console.log(`Cleaned up final file: ${finalFilePath}`);
    } else {
      console.log(`No cleanup needed, file does not exist: ${finalFilePath}`);
    }
  }
}

