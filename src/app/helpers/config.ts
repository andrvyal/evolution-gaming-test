export interface AppConfig extends CommonConfig {
    production: boolean;
}

export interface CommonConfig {
    levelCount: number;
    socketUrl: string;
}
