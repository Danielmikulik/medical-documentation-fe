import { Buffer } from 'buffer';
export default function parseJwt(token) {
    if (!token) return;
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
}
