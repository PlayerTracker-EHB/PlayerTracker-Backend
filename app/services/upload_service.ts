import drive from '@adonisjs/drive/services/main'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import { promisify } from 'node:util'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

const unlink = promisify(fs.unlink)

export class UploadService {
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
    const chunksDir = this.ensureChunkDirectory()

    await chunk.move(chunksDir, {
      name: `${name}_${chunkIndex}`,
      overwrite: true
    })

    return true
  }

  async combineAndStoreFile(filename: string, totalChunks: number) {
    const finalFilePath = app.makePath('tmp', `complete_${filename}`);
    const writeStream = fs.createWriteStream(finalFilePath);

    try {
      // Combine chunks
      await this.combineChunks(filename, totalChunks, writeStream);

      // Upload to storage
      await this.uploadFinalFile(filename, finalFilePath);

      // Cleanup
      await this.cleanup(finalFilePath);

      return true;
    } catch (error) {
      // Ensure cleanup on error
      if (fs.existsSync(finalFilePath)) {
        await unlink(finalFilePath);
      }
      throw error;
    }
  }

  private async combineChunks(filename: string, totalChunks: number, writeStream: fs.WriteStream) {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = this.getTempChunkPath(filename, i)
      const chunkContent = await fs.promises.readFile(chunkPath)

      await new Promise((resolve, reject) => {
        writeStream.write(chunkContent, (error) => {
          if (error) reject(error)
          resolve(true)
        })
      })

      // Delete chunk after combining
      await unlink(chunkPath)
    }

    writeStream.end()
  }

  private sanitizeFilename(filename: string): string {
    // Replace illegal characters with hyphen
    return filename.replace(/[^A-Za-z0-9\-_\/\!\.\s]/g, '-')
  }

  private async uploadFinalFile(filename: string, finalFilePath: string) {
    const finalFileContent = await fs.promises.readFile(finalFilePath)
    const disk = drive.use('fs')

    // Sanitize the filename before uploading
    const sanitizedFilename = this.sanitizeFilename(filename)

    await disk.put(`videos/${sanitizedFilename}`, finalFileContent, {
      contentType: 'video/mp4',
    })
  }

  private async cleanup(finalFilePath: string) {
    if (fs.existsSync(finalFilePath)) {
      await unlink(finalFilePath)
    }
  }
}

