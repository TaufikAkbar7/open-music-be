/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
 pgm.createTable('t_collaborations', {
  id: {
    type: 'uuid',
    primaryKey: true,
  },
  playlist_id: {
    type: 'uuid',
    notNull: true,
    references: '"t_playlists"',
    onDelete: 'cascade'
  },
  user_id: {
    type: 'uuid',
    notNull: true,
    references: '"t_users"',
    onDelete: 'cascade'
  },
 });
 pgm.createIndex('t_collaborations', 'playlist_id');
 pgm.createIndex('t_collaborations', 'user_id');
};
   
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
 pgm.dropTable('t_collaborations', {
  cascade: true
 });
 pgm.dropIndex('t_collaborations', 'playlist_id');
 pgm.dropIndex('t_collaborations', 'user_id');
};
      