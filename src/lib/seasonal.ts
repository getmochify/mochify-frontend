/**
 * Seasonal dress-up for the 404 mochi. The character itself never changes;
 * a theme only adds props around it (and swaps what it says when squished).
 *
 * A build-time constant rather than a runtime flag, same as DAY_PASS_ENABLED:
 * set it back to 'default' after the festival and deploy.
 */
export type MochiTheme = 'default' | 'diwali';

export const MOCHI_THEME: MochiTheme = 'diwali';
