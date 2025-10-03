export namespace DEFAULT_STORAGE_URLS {
    let oss: any;
    let cloud: any;
    let serverless: any;
    let core: any;
    let enterprise: any;
    let dedicated: any;
    let clustered: any;
    let prev_oss: any;
    let prev_cloud: any;
    let prev_core: any;
    let prev_enterprise: any;
    let prev_serverless: any;
    let prev_dedicated: any;
    let prev_clustered: any;
    let custom: string;
}
export const defaultUrls: {};
export function initializeStorageItem(storageKey: any, defaultValue: any): void;
export function getPreference(prefName: any): any;
export function setPreference(prefID: any, prefValue: any): void;
export function getPreferences(): any;
export function getInfluxDBUrls(): any;
export function getInfluxDBUrl(product: any): any;
export function setInfluxDBUrls(updatedUrlsObj: any): void;
export function removeInfluxDBUrl(product: any): void;
export function getNotifications(): any;
export function notificationIsRead(notificationID: any, notificationType: any): any;
export function setNotificationAsRead(notificationID: any, notificationType: any): void;
//# sourceMappingURL=local-storage.d.ts.map