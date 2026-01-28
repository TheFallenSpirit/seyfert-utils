/* A generic true or false choice array for string command options. */
export const trueOrFalse = [
    { name: 'Yes', value: 'true' },
    { name: 'No', value: 'false' }
];

/* A regex that matches HEX color codes. */
export const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;

/* A regex that matches user mentions. */
export const userMentionRegex = /<@(?<id>\d{17,20})>/;

/* A regex that matches role mentions */
export const roleMentionRegex = /<@&(?<id>\d{17,20})>/;

/* A regex that matches channel mentions. */
export const channelMentionRegex = /<#(?<id>\d{17,20})>/;
