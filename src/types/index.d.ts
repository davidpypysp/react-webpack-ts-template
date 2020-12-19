declare namespace xassistant {
    export interface StreamConfig {
        id: string;
        onStreamConnected: (event: MediaStream) => any;
        videoSrc?: string;
        audioSrc?: string;
    }
}

export = xassistant;
export as namespace xassistant;
