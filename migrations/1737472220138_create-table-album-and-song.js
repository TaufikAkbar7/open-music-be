/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
 exports.up = (pgm) => {
    pgm.createTable('t_album', {
        id: {
            type: 'uuid',
            primaryKey: true
        },
        name: { type: 'varchar(255)', notNull: true },
        year: {
          type: 'int4',
          notNull: true,
        },
      });
      pgm.createTable('t_song', {
        id: {
            type: 'uuid',
            primaryKey: true
        },
        album_id: {
            type: 'uuid',
            notNull: true,
            references: '"t_album"',
            onDelete: 'cascade',
          },
        title: { type: 'varchar(255)', notNull: true },
        genre: { type: 'varchar(255)', notNull: true },
        performer: { type: 'varchar(255)', notNull: true },
        duration: { type: 'int4', notNull: true },
        year: {
          type: 'int4',
          notNull: true,
        },
      });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('t_album');
    pgm.dropTable('t_song');
};
