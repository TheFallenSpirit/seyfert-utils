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

/* Default hex colours I use across my projects. */
export const colors = {
    gold: 0xefbf04,
    orange: 0xffa800,
    yellow: 0xfaff6d,

    red: 0xfa0000,
    darkRed: 0x780606,
    lightRed: 0xfc5757,
    burgundy: 0x660033,

    olive: 0x636b2f,
    green: 0x008d3d,
    darkGreen: 0x004d22,
    lightGreen: 0x5cd25c,

    blue: 0x00a1ff,
    darkBlue: 0x0056ac,
    lightBlue: 0x59c2ff,

    purple: 0x9747ff,
    lavender: 0xbc87fd,
    darkPurple: 0x7517f0,

    pink: 0xff61e7,
    darkPink: 0x9c009c,
    lightPink: 0xffa3f1
};
