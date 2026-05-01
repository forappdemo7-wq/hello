import { readDataFile, writeDataFile } from './fileStorage';
import crypto from 'crypto';

const TOKENS_FILE = 'reset-tokens.json';

export interface ResetToken {
  token: string;
  email: string;
  role: 'admin' | 'user';
  expiresAt: number; // timestamp
}

export function generateResetToken(email: string, role: 'admin' | 'user'): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  const tokens = readDataFile<ResetToken>(TOKENS_FILE);
  tokens.push({ token, email, role, expiresAt });
  writeDataFile(TOKENS_FILE, tokens);
  return token;
}

export function validateResetToken(token: string): ResetToken | null {
  const tokens = readDataFile<ResetToken>(TOKENS_FILE);
  const record = tokens.find(t => t.token === token && t.expiresAt > Date.now());
  return record || null;
}

export function consumeResetToken(token: string): void {
  const tokens = readDataFile<ResetToken>(TOKENS_FILE);
  const filtered = tokens.filter(t => t.token !== token);
  writeDataFile(TOKENS_FILE, filtered);
}