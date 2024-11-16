import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const appSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
