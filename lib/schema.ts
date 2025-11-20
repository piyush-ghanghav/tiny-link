import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const link = pgTable('Link', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 255 }).notNull().unique(),
  target_url: text('target_url').notNull(),
  clicks: integer('clicks').notNull().default(0),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  last_clicked_at: timestamp('last_clicked_at'),
  deleted_at: timestamp('deleted_at'),
});