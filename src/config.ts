export const COLORS = {
    PRIMARY:    0x5865F2,  // Discord mavisi - genel bilgi
    SUCCESS:    0x57F287,  // Yeşil - başarı
    ERROR:      0xED4245,  // Kırmızı - hata/moderasyon
    WARNING:    0xFEE75C,  // Sarı - uyarı
    FUN:        0x9B59B6,  // Mor - eğlence
    INFO:       0x3498DB,  // Mavi - bilgi
} as const;

export const BOT_NAME = 'GeekHub Bot';

export const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
    general:    { emoji: '⚙️',  label: 'Genel' },
    moderation: { emoji: '🛡️', label: 'Moderasyon' },
    fun:        { emoji: '🎮', label: 'Eğlence' },
    utility:    { emoji: '🔧', label: 'Araçlar' },
};
