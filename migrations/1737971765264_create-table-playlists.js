/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
 pgm.createTable('t_playlists', {
  id: {
    type: 'uuid',
    primaryKey: true,
  },
  name: {
    type: 'VARCHAR(50)',
    notNull: true,
  },
  owner: {
    type: 'uuid',
    notNull: true,
    references: '"t_users"',
    onDelete: 'cascade'
  },
 });
 pgm.createIndex('t_playlists', 'owner');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
 pgm.dropTable('t_playlists');
};
