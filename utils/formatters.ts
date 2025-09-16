
const SI_SYMBOLS = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
];

export const formatNumber = (num: number, digits = 2): string => {
    if (num < 1000) {
        return num.toFixed(Math.min(digits, 2));
    }

    const tier = SI_SYMBOLS.slice().reverse().find(symbol => num >= symbol.value);
    if (tier) {
        const value = num / tier.value;
        return value.toFixed(digits) + tier.symbol;
    }
    return num.toFixed(digits);
};

export const formatTime = (seconds: number = 0): string => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};