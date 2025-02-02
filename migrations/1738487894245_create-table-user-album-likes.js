/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
 pgm.createTable('t_user_album_likes', {
   id: {
    type: 'uuid',
    primaryKey: true
   },
   user_id: {
    type: 'uuid',
    notNull: true,
    references: '"t_users"',
    onDelete: 'cascade'
  },
  album_id: {
    type: 'uuid',
    notNull: true,
    references: '"t_album"',
    onDelete: 'cascade'
  },
 });
 pgm.createIndex('t_user_album_likes', 'user_id');
 pgm.createIndex('t_user_album_likes', 'album_id');
};
   
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
 pgm.dropTable('t_user_album_likes');
 pgm.dropIndex('t_user_album_likes', 'user_id');
 pgm.dropIndex('t_user_album_likes', 'album_id');
};
   