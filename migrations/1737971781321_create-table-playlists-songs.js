/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
 pgm.createTable('t_playlist_songs', {
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
    notNull: true,
    references: '"t_song"',
    onDelete: 'cascade'
  },
 });
 pgm.createIndex('t_playlist_songs', 'playlist_id');
 pgm.createIndex('t_playlist_songs', 'song_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
 pgm.dropTable('t_playlist_songs');
 pgm.createIndex('t_playlist_songs', 'playlist_id');
 pgm.createIndex('t_playlist_songs', 'song_id');
};
   