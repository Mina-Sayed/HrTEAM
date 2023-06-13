declare global
{
    namespace NodeJS
    {
        interface ProcessEnv
        {
            PORT: string;
            NODE_ENV: "development" | "production" | "test";
            MONGO_URI: string;
            JWT_KEY: string;
            JWT_AGE: number;
        }
    }
}

export {};