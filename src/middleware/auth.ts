import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { CustomError } from './errorHandler';

type AuthConfig = {
  allowedTokens: string[];
  headerName: string;
};

/**
 * Simple token-based auth middleware.
 * Accepts either:
 * - Authorization: Bearer <token>
 * - X-API-KEY: <token>
 * Only tokens listed in config.auth.allowedTokens are permitted.
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authCfg = (config.auth || {}) as unknown as AuthConfig;
  const headerName = (authCfg && authCfg.headerName) || 'authorization';
  const headerValue = req.headers[headerName] || req.headers['x-api-key'] || '';
  const authHeaderRaw = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const authHeader =
    typeof authHeaderRaw === 'string' ? authHeaderRaw : String(authHeaderRaw || '');

  let token = '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    token = authHeader.trim();
  }

  if (!token) {
    throw new CustomError('Authentication required', 401);
  }

  const allowed: string[] = authCfg.allowedTokens || [];

  if (!allowed.includes(token)) {
    throw new CustomError('Forbidden', 403);
  }

  // Optionally attach info to request (e.g., req.user = { token })
  next();
};

export default requireAuth;
