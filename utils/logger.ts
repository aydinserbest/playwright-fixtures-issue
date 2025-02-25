

export class APILogger {
    private recentLog: any[] = []

    logRequest(method: string, url: string, headers: Record<string, string>, body?: any) {
        const logEntry = { method, url, headers, body }
        this.recentLog.push({type:  'request details', data: logEntry})
    }

    logResponse(statusCode: number, body?: any) {
        const logEntry = { statusCode, body }
        this.recentLog.push({type:  'response details', data: logEntry})
    }

    getRecentLogs() {
        const logs = this.recentLog.map(log => {
            return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}`
    }).join('\n\n')
    return logs
    }
}