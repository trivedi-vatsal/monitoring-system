import { createCipheriv, createDecipheriv } from 'crypto'
import { app } from '../app'

const algorithm = 'aes-256-gcm'

export const encrypt = (text: string) => {
  const keyString = app.get('encryptionKey')
  if (!keyString) {
    throw new Error('Encryption key is not configured.')
  }
  const key = Buffer.from(keyString, 'hex')
  const iv = Buffer.alloc(16, 0) // Initialization vector.
  const cipher = createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')
  return { iv: iv.toString('hex'), encryptedData: encrypted, authTag }
}

export const decrypt = (encrypted: { iv: string; encryptedData: string; authTag: string }) => {
  const keyString = app.get('encryptionKey')
  if (!keyString) {
    throw new Error('Encryption key is not configured.')
  }
  const key = Buffer.from(keyString, 'hex')
  const iv = Buffer.from(encrypted.iv, 'hex')
  const decipher = createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'))
  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
