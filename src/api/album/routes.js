const routes = (handler) => [
  {
    method: 'POST',
    path: '/album',
    handler: handler.createAlbum,
  },
  {
    method: 'GET',
    path: '/album',
    handler: handler.getAlbums,
  },
  {
    method: 'GET',
    path: '/album/{id}',
    handler: handler.getAlbum,
  },
  {
    method: 'PUT',
    path: '/album/{id}',
    handler: handler.updateAlbum,
  },
  {
    method: 'DELETE',
    path: '/album/{id}',
    handler: handler.deleteAlbum,
  },
];
  
module.exports = routes