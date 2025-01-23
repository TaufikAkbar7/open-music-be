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
    notNull: true
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
};
