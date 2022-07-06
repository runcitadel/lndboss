import * as dotenv from 'dotenv';

import { Logger, SetMetadata } from '@nestjs/common';

import { CronExpression } from '@nestjs/schedule';
import { join } from 'path';
import { randomBytes } from 'crypto';

dotenv.config({ path: join(__dirname, '../../../.env') });
dotenv.config({ path: join(__dirname, '../../../.env.local') });

// Check if the environment is production
export const isProduction = process.env.NODE_ENV === 'production';

Logger.log(`isProduction: ${isProduction}`);

// These constants are for setting @Public() decorator
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// These constants are for setting @Private() decorator

// JWT secret key
export const jwtConstants = {
  secret: !!isProduction ? randomBytes(64).toString('hex') : process.env.JWT_SECRET_DEV,
};

// Encryption key
export const encryptionKey =
  !!process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY !== '' ? process.env.ENCRYPTION_KEY : undefined;

// Encryption algorithm
export const algorithm = 'aes-256-cbc';

// Amboss API URL
export const ambossUrl = 'https://api.amboss.space/graphql';

// Amboss Health Check Cron Schedule
export const ambossHealthCheckCronSchedule = CronExpression.EVERY_30_MINUTES;
