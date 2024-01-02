import dotenv from 'dotenv';
dotenv.config();

import OpenAi from 'openai';

const openai = new OpenAi();

export { openai };
