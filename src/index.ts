import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc.js';

dayjs.extend(utcPlugin);

export * from './utilities.js';
export * from './variables.js';

// export * from './components/modal.js';
// export * from './components/message.js';
