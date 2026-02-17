import { OKFunction, GuildRole, StopFunction, AllGuildChannels, CommandContext, User, OnOptionsReturnObject } from 'seyfert';
import { isValidSnowflake } from './utilities.js';
import dayjs from 'dayjs';
import ms, { StringValue } from 'ms';
import fuzzy from 'fuzzysort';
import { channelMentionRegex, hexRegex, roleMentionRegex, userMentionRegex } from './variables.js';
import { ChannelType } from 'seyfert/lib/types/index.js';
import { noCase } from 'change-case';

interface StringOption {
    value: string;
    context: CommandContext;
}

/* Returns a valid string snowflake value. */
export const snowflakeOptionValue = ({ value }: StringOption, ok: OKFunction<string>, fail: StopFunction) => {
    if (isValidSnowflake(value)) return ok(value);
    return fail(`The provided string isn't a valid snowflake.`);
};

/* Returns a valid numerical color code for the Discord API. */
export const colorHexOptionValue = ({ value }: StringOption, ok: OKFunction<number>, fail: StopFunction) => {
    if (!value.startsWith('#')) value = `#${value}`;

    if (value.match(hexRegex)) {
        if (value === '#000000') value = '#000001';
        return ok(parseInt(value.replace('#', '0x')));
    };

    return fail(`The specified color "${value}" isn't a valid HEX code (format: #faff6d).`);
};

/* Returns a valid date object from the provided string value. */
export function dateOptionValue({ value }: StringOption, ok: OKFunction<Date>, fail: StopFunction) {
    const date = dayjs.utc(value);
    if (date.isValid()) return ok(date.toDate());
    else return fail(`The specified date "${date}" isn't a valid date.`);
};

/* Returns a valid date object from the provided string value. */
export function relativeTimeOptionValue({ value }: StringOption, ok: OKFunction<number>, fail: StopFunction) {
    const relativeMs = ms(value as StringValue);
    if (isNaN(relativeMs)) return fail(`The provided time value isn't a valid amount of time.`);
    return ok(relativeMs);
};

/* Returns an array of roles from the provided string value. */
export async function rolesOptionValue(
    { value: values, context }: StringOption,
    ok: OKFunction<[GuildRole, ...GuildRole[]]>,
    fail: StopFunction
) {
    const guild = await context.guild();
    if (!guild) return fail("The guild this command was used in wasn't found.");

    const resolvedRoles: GuildRole[] = [];
    const roles = await guild.roles.list();

    for (const value of values.split(',').map((value) => value.trim())) {
        let role: GuildRole | undefined;
        const mentionMatch = roleMentionRegex.exec(value)?.[1];

        if (mentionMatch) role = roles.find(({ id }) => mentionMatch === id);
        if (!role && isValidSnowflake(value)) role = roles.find(({ id }) => value === id);

        if (!role) {
            const formattedRoles = roles.map(({ id, name }) => ({ id: id, name: fuzzy.prepare(name) }));
            const match = fuzzy.go(value, formattedRoles, { key: 'name' })[0];
            if (match) role = roles.find(({ id }) => match.obj.id === id);
        };

        if (role) resolvedRoles.push(role);
        else return fail(`Hold up! | The specified role "${value}" wasn't found.`);
    };

    if (resolvedRoles.length < 1) return fail(`Hold up! | You didn't specify any valid roles.`);
    // @ts-expect-error
    ok(resolvedRoles);
};

/* Returns an array of channels from the provided string value. */
export async function channelsOptionValue(
    { value: values, context }: StringOption,
    ok: OKFunction<[AllGuildChannels, ...AllGuildChannels[]]>,
    fail: StopFunction
) {
    const guild = await context.guild();
    if (!guild) return fail("The guild this command was used in wasn't found.");

    const resolvedChannels: AllGuildChannels[] = [];
    let channels = (await guild.channels.list()) as AllGuildChannels[];
    channels = channels.filter((ch) => !ch.isThread() && ('name' in ch));

    for (const value of values.split(',').map((value) => value.trim())) {
        let channel: AllGuildChannels | undefined;
        const mentionMatch = channelMentionRegex.exec(value)?.[1];

        if (mentionMatch) channel = channels.find(({ id }) => mentionMatch === id);
        if (!channel && isValidSnowflake(value)) channel = channels.find(({ id }) => value === id);

        if (!channel) {
            // @ts-expect-error
            const formattedChannels = channels.map(({ id, name }) => ({ id: id, name: fuzzy.prepare(name) }));
            const match = fuzzy.go(value, formattedChannels, { key: 'name' })[0];
            if (match) channel = channels.find(({ id }) => match.obj.id === id);
        };

        if (channel) resolvedChannels.push(channel);
        else return fail(`Hold up! | The specified channel "${channel}" wasn't found.`);
    };

    if (resolvedChannels.length < 1) return fail(`Hold up! | You didn't specify any valid channels.`);
    // @ts-expect-error
    ok(resolvedChannels);
};

/* Returns an array of users from the provided string value. */
export async function usersOptionValue(
    { value: values, context }: StringOption,
    ok: OKFunction<[User, ...User[]]>,
    fail: StopFunction
) {
    const resolvedUsers: User[] = [];
    
    for await (const value of values.split(',').map((value) => value.trim())) {
        let user: User | undefined;
        const mentionMatch = userMentionRegex.exec(value)?.[1];

        if (mentionMatch) user = await context.client.users.fetch(mentionMatch).catch(() => undefined);
        if (!user && isValidSnowflake(value)) user = await context.client.users.fetch(value).catch(() => undefined);

        if (user) resolvedUsers.push(user);
        else return fail(`Hold up! | The specified user "${user}" wasn't found.`);
    };

    if (resolvedUsers.length < 1) return fail(`Hold up! | You didn't specify any valid users.`);
    // @ts-expect-error
    ok(resolvedUsers);
};

/* Checks the provided options for validation errors and returns user friendly error messages. */
export async function validateOptions(metadata: OnOptionsReturnObject): Promise<string[]> {
    const errorMessages: string[] = [];

    for (const [option, error] of Object.entries(metadata)) {
        if (!error.failed) continue;

        let errorMessage: string | undefined;
        if (error.value.includes('is required but returned no value')) {
            errorMessage = "is required but wasn't provided";
        };
        
        if (error.value.includes('Unknown Role 10011')) errorMessage = "isn't a valid role mention or ID";
        if (error.value.includes('Unknown User 10013')) errorMessage = "isn't a valid user mention or ID";
        if (error.value.includes('Unknown Channel 10003')) errorMessage = "isn't a valid channel mention or ID";

        const parseError = error.parseError?.[0];
        const parseErrorValue = error.parseError?.[1];

        switch (parseError) {
            case 'NUMBER_NAN': errorMessage = `isn't a valid number.`; break;
            case 'NUMBER_MAX_VALUE': errorMessage = `must be less than or equal to ${parseErrorValue}`; break;
            case 'NUMBER_MIN_VALUE': errorMessage = `must be greater than or equal to ${parseErrorValue}`; break;

            case 'STRING_MAX_LENGTH':
                errorMessage = `must be less than or equal to ${parseErrorValue} characters long`;
                break;

            case 'STRING_MIN_LENGTH':
                errorMessage = `must be greater than or equal to ${parseErrorValue} characters long`;
                break;

            case 'NUMBER_INVALID_CHOICE':
            case 'STRING_INVALID_CHOICE':
                errorMessage = `must be equal to ${listFormat((parseErrorValue as ChoiceObject[]))}`;
                break;

            case 'CHANNEL_TYPES':
                errorMessage = `must be a ${channelTypeFormat((parseErrorValue as number[]))} channel mention or ID`;
                break;

            case 'UNKNOWN':
            case 'OPTION_REQUIRED':
                errorMessage = `was provided but isn't valid`;
                break;
        };

        if (!errorMessage) errorMessage = error.value.replace(`${option} `, '');
        errorMessages.push(`The option "${option}" ${errorMessage}.`);
    };

    return errorMessages;
};

interface ChoiceObject {
    name: string;
    value: number | string;
}

function listFormat(options: (string | ChoiceObject)[]) {
    const formatter = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' });

    const mappedOptions = options.map((option) => {
        return typeof option === 'string' ? option.toLowerCase() : option.value.toString().toLowerCase();
    });

    return formatter.format(mappedOptions);
};

function channelTypeFormat(types: number[]) {
    return listFormat(types.map((type) => noCase(ChannelType[type] ?? '').replace('guild ', '')));
};
