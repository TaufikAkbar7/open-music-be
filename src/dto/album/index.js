const DTOAlbumSongs = (data = []) => {
  const mappingResults = data.reduce((acc, item) => {
    let obj = acc
    if (!obj) {
      obj = {
        id: item.album_id,
        name: item.album_name,
        year: item.album_year,
        coverUrl: item.album_cover_url,
        songs: []
      }
    }
    if (item.song_id && item.song_title && item.song_performer) {
      obj.songs.push({
        id: item.song_id,
        title: item.song_title,
        performer: item.song_performer
      })
    }
    return obj
  }, null)

  return mappingResults
}

module.exports = DTOAlbumSongs
