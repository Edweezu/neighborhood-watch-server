module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 
    'postgresql://dunder-mifflin@localhost/neighborhood-db',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '10m'
}