import React, { useState, useMemo } from 'react'
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
  // Default and Lady Gaga playlists
  const initialDefaultTracks = [
    { title: 'Track 1', src: '/music/track1.mp3' },
    { title: 'Track 2', src: '/music/track2.mp3' },
    { title: 'Track 3', src: '/music/track3.mp3' },
    { title: 'Track 4', src: '/music/track4.mp3' },
    { title: 'Track 5', src: '/music/track5.mp3' },
  ];
  const ladyGagaTracks = [
    { title: 'Lady Gaga - Killah (Saturday Night Live 2025)', src: '/music/lady gaga/Lady Gaga - Killah (Saturday Night Live_2025).mp3' },
    { title: 'Lady Gaga - Abracadabra (Saturday Night Live 2025)', src: '/music/lady gaga/Lady Gaga - Abracadabra (Saturday Night Live_2025).mp3' },
    { title: 'Lady Gaga - Abracadabra (Rehearsal Video)', src: '/music/lady gaga/Lady Gaga - Abracadabra (Rehearsal Video).mp3' },
    { title: 'Lady Gaga - Abracadabra (Official Music Video)', src: '/music/lady gaga/Lady Gaga - Abracadabra (Official Music Video).mp3' },
  ];

  const hindiTracks = [
    { title: 'Aasan Nahin Yahan (Aashiqui 2)', src: '/music/hindi songs/Aasan Nahin Yahan Aashiqui 2 320 Kbps.mp3' }
  ];

  const [defaultTracks, setDefaultTracks] = useState(initialDefaultTracks);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playOnSelect, setPlayOnSelect] = useState(false);
  // playlistType: 'random', 'default', 'ladygaga', 'hindi', or artist/album name
  const [playlistType, setPlaylistType] = useState('random');

  // Handler to select and auto-play track from playlist
  const handleSelectTrack = (idx) => {
    setCurrentTrack(idx);
    setPlayOnSelect(true);
  };

  // Combine all tracks for random playlist
  const allTracks = useMemo(() => [
    ...initialDefaultTracks,
    ...ladyGagaTracks,
    ...hindiTracks
  ], [initialDefaultTracks, ladyGagaTracks, hindiTracks]);

  // Shuffle helper
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Store random playlist in state so it doesn't reshuffle on every render
  const [randomTracks, setRandomTracks] = useState(() => shuffle(allTracks).slice(0, 10));

  // Handler for artist click
  const handleArtistClick = (artist) => {
    if (artist === 'Lady Gaga') {
      setPlaylistType('ladygaga');
      setCurrentTrack(0);
      setPlayOnSelect(true);
    } else if (artist === 'Hindi Songs') {
      setPlaylistType('hindi');
      setCurrentTrack(0);
      setPlayOnSelect(true);
    } else {
      // Add more artist logic here if needed
      setPlaylistType(artist);
      setCurrentTrack(0);
      setPlayOnSelect(false);
    }
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
              tracks={
                playlistType === 'random' ? randomTracks :
                playlistType === 'ladygaga' ? ladyGagaTracks :
                playlistType === 'hindi' ? hindiTracks :
                defaultTracks
              }
              title={
                playlistType === 'random' ? 'My Playlist (Random Mix)' :
                playlistType === 'ladygaga' ? 'Lady Gaga Playlist' :
                playlistType === 'hindi' ? 'Hindi Songs Playlist' :
                'My Playlist'
              }
              onDropFiles={files => {
                // Only allow adding to default playlist
                if (playlistType !== 'default') return;
                const newTracks = Array.from(files)
                  .filter(file => file.type.startsWith('audio/'))
                  .map(file => ({
                    title: file.name,
                    src: URL.createObjectURL(file)
                  }));
                if (newTracks.length > 0) {
                  setDefaultTracks(prev => [...prev, ...newTracks]);
                }
              }}
              allowDrop={playlistType === 'default'}
            />
          </Box>
          {playlistType !== 'random' && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#fff',
                  color: '#1976d2',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
                onClick={() => {
                  setRandomTracks(shuffle(allTracks).slice(0, 10));
                  setPlaylistType('random');
                  setCurrentTrack(0);
                  setPlayOnSelect(false);
                }}
              >
                Random Mix
              </button>
            </Box>
          )}
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
          <PopularArtists onArtistClick={handleArtistClick} />
          <Player
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
            playOnSelect={playOnSelect}
            setPlayOnSelect={setPlayOnSelect}
            tracks={
              playlistType === 'random' ? randomTracks :
              playlistType === 'ladygaga' ? ladyGagaTracks :
              playlistType === 'hindi' ? hindiTracks :
              defaultTracks
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
