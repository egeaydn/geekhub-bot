import * as fs   from 'fs';
import * as path from 'path';

interface WarnEntry {
    reason:    string;
    moderator: string;
    timestamp: number;
}

interface WarnsData {
    [userId: string]: WarnEntry[];
}

// data/ klasörü proje kökünde tutulur
const DATA_DIR   = path.join(__dirname, '..', '..', 'data');
const WARNS_FILE = path.join(DATA_DIR, 'warns.json');

function ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function loadWarns(): WarnsData {
    ensureDataDir();
    if (!fs.existsSync(WARNS_FILE)) {
        fs.writeFileSync(WARNS_FILE, '{}', 'utf-8');
        return {};
    }
    return JSON.parse(fs.readFileSync(WARNS_FILE, 'utf-8')) as WarnsData;
}

function saveWarns(data: WarnsData): void {
    ensureDataDir();
    fs.writeFileSync(WARNS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function addWarn(userId: string, reason: string, moderator: string): number {
    const data = loadWarns();
    if (!data[userId]) data[userId] = [];
    data[userId].push({ reason, moderator, timestamp: Date.now() });
    saveWarns(data);
    return data[userId].length;
}

export function getWarns(userId: string): WarnEntry[] {
    return loadWarns()[userId] ?? [];
}

export function clearWarns(userId: string): void {
    const data = loadWarns();
    delete data[userId];
    saveWarns(data);
}
