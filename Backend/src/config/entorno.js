export const entorno = {
    puerto: process.env.PORT || 3000,
    jwtSecreto: process.env.JWT_SECRET,
    jwtExpira: process.env.JWT_EXPIRA || '8h',
};

if (!entorno.jwtSecreto) {
    throw new Error('Falta JWT_SECRET en el archivo .env');
}