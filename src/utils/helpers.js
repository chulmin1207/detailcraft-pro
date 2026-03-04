// ===== UTILITY FUNCTIONS =====

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function addLog(container, message, type) {
    const item = document.createElement('div');
    item.className = `log-item log-${type}`;
    item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    container.appendChild(item);
    container.scrollTop = container.scrollHeight;
}
