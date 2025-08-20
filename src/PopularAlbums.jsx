import React from "react";
import { Box, Grid, Card, CardMedia, Typography } from "@mui/material";

const PopularAlbums = () => {
  return (
    <Box sx={{ marginTop: '40px', width: '100%' }}>
      <Typography variant="h6">Popular Albums</Typography>
      <Grid container spacing={2} justifyContent="center">
        {
          [
            { title: 'Children of Bodom', image: '/images/albums/children of bodom.jpg' },
            { title: 'Black Water', image: '/images/albums/black water.jpg' },
            { title: 'Hurts 2B Human', image: '/images/albums/hut 2B human.png' },
            { title: 'No Sound Without', image: '/images/albums/no sound without.png' },
                { title: 'Blue Neighbourhood', image: '/images/albums/blue neighbourhood.jpg' },
                { title: 'Origins', image: '/images/albums/origin.png' }
          ].map((album, index) => (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <Card sx={{ backgroundColor: 'transparent'}}>
                <CardMedia
                  component="img"
                  alt={album.title}
                  height="140"
                  image={album.image}
                  onError={e => e.target.src = 'https://via.placeholder.com/150?text=No+Image'}
                />
                <Typography variant="body2" sx={{ padding: '10px', textAlign: 'center', color: '#fff' }}>
                  {album.title}
                </Typography>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </Box>
  );
};

export default PopularAlbums;