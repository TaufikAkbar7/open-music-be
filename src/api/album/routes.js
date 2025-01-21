const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.createAlbum,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbum,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.updateAlbum,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbum,
  },
];
  
module.exports = routes