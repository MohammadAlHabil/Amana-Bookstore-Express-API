"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const config_1 = __importDefault(require("../config"));
const errorHandler_1 = require("./errorHandler");
const requireAuth = (req, _res, next) => {
    const authCfg = (config_1.default.auth || {});
    const headerName = (authCfg && authCfg.headerName) || 'authorization';
    const headerValue = req.headers[headerName] || req.headers['x-api-key'] || '';
    const authHeaderRaw = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const authHeader = typeof authHeaderRaw === 'string' ? authHeaderRaw : String(authHeaderRaw || '');
    let token = '';
    if (authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.slice(7).trim();
    }
    else {
        token = authHeader.trim();
    }
    if (!token) {
        throw new errorHandler_1.CustomError('Authentication required', 401);
    }
    const allowed = authCfg.allowedTokens || [];
    if (!allowed.includes(token)) {
        throw new errorHandler_1.CustomError('Forbidden', 403);
    }
    next();
};
exports.requireAuth = requireAuth;
exports.default = exports.requireAuth;
//# sourceMappingURL=auth.js.map