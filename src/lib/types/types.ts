// 持久化通知
export interface PersistentNotification {
    created_at: string;
    message: string;
    notification_id: string;
    title: string;
    status?: string;
}

// Konva 画布状态
export interface KonvaStore {
    children: any[];
    selectedShapes: any[];
    mode: string;
    undoStack: any[];
    redoStack: any[];
}

// Konva 图片缓存
export interface KonvaImageCache {
    [key: string]: HTMLImageElement;
} 