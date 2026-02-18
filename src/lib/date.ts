import {
    format,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    isThisYear
} from 'date-fns';

export interface FormatDateOptions {
    /**
     * Use relative time (just now, 5m, 2h, yesterday, 5d, 3w)
     * If false, uses absolute date (Feb 9).
     * @default true
     */
    relative?: boolean;
    /**
     * Include 12-hour time (e.g. 4:17 PM)
     * Only applies when falling back to absolute date, or if forced?
     * @default false
     */
    showTime?: boolean;
    /**
     * Allow weeks unit (e.g. 3w).
     * If false, switches to absolute after days limit.
     * @default true
     */
    weeks?: boolean;
    /**
     * Add " ago" suffix to relative time (except "just now").
     * @default false
     */
    suffix?: boolean;
    /**
     * Custom absolute date format string (date-fns format).
     * @default undefined (uses standard App default)
     */
    dateFormat?: string;
    /**
     * Use special formatting for chat messages.
     * < 1 week: "Day time" (e.g. Sat 4:18 AM)
     * > 1 week: "Month day, year, time" (e.g. Feb 7, 2026, 4:17 AM)
     * @default false
     */
    chatFormat?: boolean;
}

export function formatAppDate(dateInput: string | Date | number | undefined | null, options: FormatDateOptions = {}): string {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const { relative = true, showTime = false, weeks = true, suffix = false, dateFormat, chatFormat = false } = options;
    const now = new Date();

    const diffMins = differenceInMinutes(now, date);
    const diffHours = differenceInHours(now, date);
    const diffDays = differenceInDays(now, date);
    const diffWeeks = differenceInWeeks(now, date);
    const timeStr = format(date, 'h:mm a');

    if (chatFormat) {
        if (diffDays < 7) {
            // "Sat 4:18 AM"
            return format(date, 'EEE h:mm a');
        } else {
            // "Feb 7, 2026, 4:17 AM"
            return format(date, 'MMM d, yyyy, h:mm a');
        }
    }

    if (relative) {
        let relativeResult = '';
        if (diffMins < 1) {
            relativeResult = 'just now';
        } else if (diffMins < 60) {
            relativeResult = `${diffMins}m`;
        } else if (diffHours < 24) {
            relativeResult = `${diffHours}h`;
        } else if (diffDays < 2) {
            relativeResult = 'yesterday';
        } else if (diffDays < 7) {
            relativeResult = `${diffDays}d`;
        } else if (weeks && diffWeeks < 5) {
            relativeResult = `${diffWeeks}w`;
        }

        if (relativeResult) {
            if (suffix && relativeResult !== 'just now' && relativeResult !== 'yesterday') {
                relativeResult += ' ago';
            }
            if (showTime) {
                return `${relativeResult}, ${timeStr}`;
            }
            return relativeResult;
        }
    }

    // Absolute
    let finalDateFormat = dateFormat;
    if (!finalDateFormat) {
        finalDateFormat = isThisYear(date) ? 'MMM d' : 'MMM d, yyyy';
    }

    let result = format(date, finalDateFormat);

    if (showTime) {
        // Avoid adding time if already included in custom format? 
        // Assuming caller handles it if they provide custom format.
        if (!dateFormat) {
            result += `, ${timeStr}`;
        }
    }

    return result;
}

export function formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const sStr = s.toString().padStart(2, '0');

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${sStr}`;
    }
    return `${m}:${sStr}`;
}

