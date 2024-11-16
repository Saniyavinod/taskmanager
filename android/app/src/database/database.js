import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { appSchema } from './schema';
import { Task } from '../models/Task';

// Create an adapter for the SQLite database
const adapter = new SQLiteAdapter({
  dbName: 'taskmanager',
  schema: appSchema,
});

// Create and export the database instance
const database = new Database({
  adapter,
  modelClasses: [Task],
  actionsEnabled: true,
});

export default database;
