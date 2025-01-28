/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
 pgm.createTable('t_playlists_song_activities', {
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
  song_id: {
    type: 'uuid',
    notNull: true
  },
  user_id: {
    type: 'uuid',
    notNull: true
  },
  action: {
    type: 'VARCHAR(50)',
    notNull: true
  },
  time: {
    type: 'TEXT',
    notNull: true
  }
 });
 pgm.createIndex('t_playlists_song_activities', 'playlist_id');
};
      
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
 pgm.dropTable('t_playlists_song_activities', {
  cascade: true
 });
 pgm.dropIndex('t_playlists_song_activities', 'playlist_id');
};
         