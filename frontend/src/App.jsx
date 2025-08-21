import React, { useState, useEffect } from 'react'
import './App.css'
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { FaPlay, FaHeart, FaStepBackward, FaStepForward } from 'react-icons/fa';
import Playlist from './Playlist';
import { Button } from '@mui/material';


// Wrapper to add 'Add Tracks' button and toggle drag-and-drop area
function PlaylistWithAddButton(props) {
  const [showDrop, setShowDrop] = React.useState(false);
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Playlist
          {...props}
          showDropArea={showDrop}
          allowDrop={props.allowDrop && showDrop}
        />
      </Box>
      {props.allowDrop && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ borderRadius: 20, fontWeight: 600, textTransform: 'none', px: 3 }}
            onClick={() => setShowDrop(v => !v)}
          >
            {showDrop ? 'Cancel' : 'Add Tracks'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
import PopularAlbums from './PopularAlbums';
import PopularArtists from './PopularArtists';
import Player from './Player';


function App() {
  // State for tracks fetched from backend
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playOnSelect, setPlayOnSelect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tracks from backend API on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://127.0.0.1:8000/tracks')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        // Map filenames to objects with title and src (use name for unique src)
        const mapped = data.map(name => ({
          title: name,
          src: `http://127.0.0.1:8000/music/${encodeURIComponent(name)}`
        }));
        setTracks(mapped);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch tracks from backend.');
        setLoading(false);
      });
  }, []);

  // Handler to select and auto-play track from playlist
  const handleSelectTrack = (idx) => {
    setCurrentTrack(idx);
    setPlayOnSelect(true);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #00bcd4, #3a9bdc)',
        color: '#fff',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
        {/* Playlist Sidebar */}
        <Box sx={{ minWidth: '250px', maxWidth: '300px', width: '25%', pr: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <PlaylistWithAddButton
              currentTrack={currentTrack}
              setCurrentTrack={handleSelectTrack}
              tracks={tracks}
              title={"All Tracks"}
              allowDrop={false}
            />
          </Box>
        </Box>
        {/* Separator */}
        <Box sx={{ width: '2px', background: 'rgba(255,255,255,0.2)', mx: 2, borderRadius: 1, minHeight: '80vh', alignSelf: 'center' }} />
        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Main Section Header */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Music Player</Typography>
          </Box>
          <PopularAlbums />
          <PopularArtists />
          <Player
            track={tracks[currentTrack]?.title}
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
            tracks={tracks}
            playOnSelect={playOnSelect}
            setPlayOnSelect={setPlayOnSelect}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
