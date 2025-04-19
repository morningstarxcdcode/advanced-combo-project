const messages: Record<string, Record<string, string>> = {
    en: {
        noActiveEditor: 'No active editor found. Please open a file to insert a timestamp.',
        failedCopy: 'Failed to copy timestamp to clipboard.',
        copiedClipboard: 'Timestamp copied to clipboard!',
        insertedTimestamp: 'Timestamp inserted!',
        selectFormat: 'Select timestamp format preset',
        selectTimezone: 'Select timezone for timestamp',
        enterCustomTimezone: 'Enter custom timezone (e.g., America/New_York)',
        startTests: 'Start all tests.',
        extensionNotActive: 'Extension is not active',
        timestampNotInserted: 'Timestamp was not inserted'
    }
    // Additional languages can be added here
};

let currentLanguage = 'en';

export function setLanguage(lang: string) {
    if (messages[lang]) {
        currentLanguage = lang;
    }
}

export function localize(key: string): string {
    return messages[currentLanguage][key] || key;
}
