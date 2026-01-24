import { DiscordSnowflake, Snowflake } from '@sapphire/snowflake';
import { customAlphabet } from 'nanoid';
import { length, slice } from 'multibyte';
import { User, GuildMember, InteractionGuildMember } from 'seyfert';
import { APIRoleColors } from 'seyfert/lib/types/index.js';
import { ObjectToLower } from 'seyfert/lib/common/index.js';

/* Sanitises a string, disabling all simple Discord markdown by prepending "\". */
export function s(content: string): string {
    return content.replace(/`/g, '\\`').replace(/\*/g, '\\*').replace(/\|/g, '\\|').replace(/_/g, '\\_');
};

/* Generates a random alphanumeric string with the provided length. */
export function randomId(length: number): string {
    return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')(length);
};

/* Pauses code execution for the provided milliseconds, allowing for in-line code pauses. */
export function wait(time: number): Promise<unknown> {
	return new Promise((resolve) => setTimeout(resolve, time));
};

/* Checks if a provided string is a valid Discord snowflake. */
export function isValidSnowflake(snowflake: string): boolean {
	if (!/^\d{17,19}$/.test(snowflake)) return false;
	const epoch = DiscordSnowflake.generate({ timestamp: DiscordSnowflake.epoch });
	return Snowflake.compare(epoch, snowflake) < 0 && Snowflake.compare(snowflake, DiscordSnowflake.generate()) < 0;
};

/* Truncates a string using UTF-8 safe encoding. */
export function truncateString(string: string, maxLength: number = 100): string {
    const strLength = length(string);
	if (strLength <= maxLength) return string;
	return `${slice(string, 0, maxLength - 3)}...`;
};

type NameType =
| 'display'
| 'display-s'
| 'display-username'
| 'display-username-s'
| 'username-id'
| 'username-id-s'

/* Formats a User or GuildMember username or display name with or without sanitisation. */
export function name(user: User | GuildMember | InteractionGuildMember, type: NameType = 'display'): string {
    const display = user instanceof User ? user.globalName : user.displayName;

	switch (type) {
		case 'display': return display ?? user.username;
		case 'display-s': return s(display ?? user.username);
		case 'display-username': return display ? `${display} (${user.username})` : user.username;
		case 'display-username-s': return s(display ? `${display} (${user.username})` : user.username);
		case 'username-id': return `${user.username} (${user.id})`;
		case 'username-id-s': return s(`${user.username} (${user.id})`);
	};
};

/* Custom reviver function for JSON.parse to handle Maps. */
export function reviver(_key: string, value: any) {
    if (typeof value === 'object' && value !== null) if (value.dataType === 'Map') return new Map(value.value);
    return value;
};

/* Custom replacer function for JSON.stringify to handle Maps. */
export function replacer(_key: string, value: any) {
    if (typeof value === 'bigint') return value.toString();
    if (value instanceof Map) return { dataType: 'Map', value: [...value]};
    return value;
};

/* Converts a number colour to a padded hex code. */
export function numberToHex(color: number) {
	return `#${color.toString(16).toUpperCase().padEnd(6, '0')}`;
};

/* Converts the API role colors object to an array of colors. */
export function apiRoleColorsToArray(apiColors: APIRoleColors | ObjectToLower<APIRoleColors>): number[] {
    const primaryColor = 'primaryColor' in apiColors ? apiColors.primaryColor : apiColors.primary_color;
    const secondaryColor = 'secondaryColor' in apiColors ? apiColors.secondaryColor : apiColors.secondary_color;
    const tertiaryColor = 'tertiaryColor' in apiColors ? apiColors.tertiaryColor : apiColors.tertiary_color;

    const colors: number[] = [];
    if (primaryColor !== 0) colors.push(primaryColor);
    if (secondaryColor) colors.push(secondaryColor);
    if (tertiaryColor) colors.push(tertiaryColor);
    return colors;
};


/* Gets a value from an object with the specified path. */
export function getValueFromPath<T extends Record<string, any>>(object: T, path: string): unknown | undefined {
    return path.split('.').reduce((acc, key) => ((acc && (key in acc)) ? acc[key] : undefined), object);
};
