import * as crypto from 'crypto';

export class SecretKeyGenerator {
    /**
     * Generates a 50-character random string for use as a Django secret key.
     */
    static generate(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)';
        const charsLength = chars.length;
        let secret = '';
        
        for (let i = 0; i < 50; i++) {
            const randomIndex = crypto.randomInt(0, charsLength);
            secret += chars[randomIndex];
        }
        
        return secret;
    }
}
