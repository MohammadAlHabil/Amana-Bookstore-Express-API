export declare const config: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly apiPrefix: "/api";
    readonly apiVersion: "v1";
    readonly pagination: {
        readonly defaultLimit: 10;
        readonly maxLimit: 100;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly max: 100;
    };
    readonly cors: {
        readonly origin: string;
        readonly credentials: true;
    };
    readonly logging: {
        readonly level: string;
        readonly logFile: "./logging/log.txt";
    };
    readonly data: {
        readonly booksPath: "./data/books.json";
        readonly reviewsPath: "./data/reviews.json";
    };
    readonly auth: {
        readonly allowedTokens: string[];
        readonly headerName: string;
    };
};
export default config;
//# sourceMappingURL=index.d.ts.map