import { supabase } from '@/integrations/supabase/client';

class ConnectionService {
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 3;
    private reconnectInterval = 5000; // 5 seconds
    private isMonitoring = false;
    private lastActivity = Date.now();
    private activityTimeout = 30000; // 30 seconds

    constructor() {
        this.setupActivityTracking();
        this.setupVisibilityChangeHandler();
    }

    private setupActivityTracking() {
        // Track user activity to detect when they're active
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivity = Date.now();
            }, { passive: true });
        });
    }

    private setupVisibilityChangeHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkConnection();
            }
        });
    }

    public startMonitoring() {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.scheduleConnectionCheck();
    }

    public stopMonitoring() {
        this.isMonitoring = false;
    }

    private scheduleConnectionCheck() {
        if (!this.isMonitoring) return;

        setTimeout(() => {
            this.checkConnection();
            this.scheduleConnectionCheck();
        }, this.reconnectInterval);
    }

    private async checkConnection() {
        try {
            // Check if user has been inactive for too long
            const timeSinceActivity = Date.now() - this.lastActivity;

            if (timeSinceActivity > this.activityTimeout) {
                // User has been inactive, check session validity
                await this.validateSession();
            }
        } catch (error) {
            console.warn('Connection check failed:', error);
            this.handleConnectionLoss();
        }
    }

    private async validateSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.warn('Session validation failed:', error);
                this.handleConnectionLoss();
                return;
            }

            if (!session) {
                console.warn('No active session found');
                this.handleConnectionLoss();
                return;
            }

            // Reset reconnect attempts on successful validation
            this.reconnectAttempts = 0;

        } catch (error) {
            console.warn('Session validation error:', error);
            this.handleConnectionLoss();
        }
    }

    private async handleConnectionLoss() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.warn('Max reconnection attempts reached');
            this.stopMonitoring();
            return;
        }

        this.reconnectAttempts++;
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        try {
            // Try to refresh the session
            const { data, error } = await supabase.auth.refreshSession();

            if (error) {
                console.warn('Session refresh failed:', error);
                // If refresh fails, try to get a new session
                await this.attemptReconnection();
            } else {
                console.log('Session refreshed successfully');
                this.reconnectAttempts = 0;
            }
        } catch (error) {
            console.warn('Reconnection attempt failed:', error);
            await this.attemptReconnection();
        }
    }

    private async attemptReconnection() {
        try {
            // Check if there's a stored session
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                console.log('Found stored session, attempting to restore...');
                // The session should be automatically restored by Supabase
                this.reconnectAttempts = 0;
            } else {
                console.warn('No stored session found');
                // If no session, the user will need to log in again
                // This is handled by the auth store
            }
        } catch (error) {
            console.warn('Reconnection failed:', error);
        }
    }

    public forceReconnect() {
        this.reconnectAttempts = 0;
        this.checkConnection();
    }
}

// Create a singleton instance
export const connectionService = new ConnectionService();

// Auto-start monitoring when the service is imported
connectionService.startMonitoring();
