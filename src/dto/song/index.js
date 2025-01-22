const DTOSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id
})

const DTOSearchSong = ({ id, title, performer }) => ({
  id,
  title,
  performer
})

module.exports = { DTOSong, DTOSearchSong }
