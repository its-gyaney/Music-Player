import React from 'react';
import { Box, Grid, IconButton, Typography, Avatar } from '@mui/material';
import { FaRegUserCircle } from 'react-icons/fa';

const artistList = [
  'Lady Gaga',
  'Bruno Mars',
  'Beyonce',
  'Dua Lipa',
  'MARUV',
  'Drake',
  'Tyga',
];

const getImageSrc = (artist) => {
  // Only use images for artists that exist in the images folder
  const fileName = artist.toLowerCase() + '.jpg';
  return `/images/${fileName}`;
};


const PopularArtists = ({ onArtistClick }) => {
  return (
    <Box sx={{ marginTop: '40px', width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Popular Artists</Typography>
      <Grid container spacing={0} justifyContent="space-between" alignItems="center" wrap="nowrap" sx={{ px: 0, flexWrap: 'nowrap', overflowX: 'auto' }}>
        {artistList.map((artist, index) => {
          const imgSrc = getImageSrc(artist);
          return (
            <Grid item key={index} sx={{ textAlign: 'center', px: 1, flex: 1, minWidth: 0 }}>
              <Box onClick={() => onArtistClick && onArtistClick(artist)} sx={{ cursor: 'pointer' }}>
                {imgSrc ? (
                  <Avatar
                    alt={artist}
                    src={imgSrc}
                    sx={{ width: 100, height: 100, margin: '0 auto', bgcolor: 'white', boxShadow: 3 }}
                  />
                ) : (
                  <IconButton sx={{ color: 'white', width: 100, height: 100 }}>
                    <FaRegUserCircle style={{ fontSize: 90 }} />
                  </IconButton>
                )}
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PopularArtists;
