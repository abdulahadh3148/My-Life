/**
 * Web Notification API & In-App Notification Manager
 */

export interface NotificationStatus {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
}

export function getNotificationPermissionStatus(): NotificationStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { supported: false, permission: 'unsupported' };
  }
  return { supported: true, permission: Notification.permission };
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (error) {
    console.warn('Failed to request notification permission:', error);
    return Notification.permission;
  }
}

export function triggerSystemNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notif = new Notification(title, {
      icon: '/icon.svg',
      badge: '/icon.svg',
      ...options
    });
    // Auto close after 6 seconds
    setTimeout(() => notif.close(), 6000);
    return true;
  } catch (err) {
    console.warn('System notification failed, relying on in-app fallback:', err);
    return false;
  }
}
