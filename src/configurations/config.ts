export default () => {
    return {
        appPort: process.env.APP_PORT,
        database: {
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            name: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expire: process.env.JWT_EXPIRE
        }
    }
}