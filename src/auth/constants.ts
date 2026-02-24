export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'fallback_secret',
};

console.log('JWT Secret:', jwtConstants.secret);
