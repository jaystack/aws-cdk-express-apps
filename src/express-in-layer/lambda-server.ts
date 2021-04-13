import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';

export const handle:any = serverlessExpress({ app });

