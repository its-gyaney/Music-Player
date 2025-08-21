
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Box, Typography, List, ListItemButton, ListItemText } from '@mui/material';

const Playlist = ({ currentTrack, setCurrentTrack, tracks, title = 'My Playlist', onDropFiles, allowDrop }) => {
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState('');
  const filteredTracks = tracks && tracks.length > 0
    ? tracks.filter(track => (track.title || '').toLowerCase().includes(search.toLowerCase()))
    : [];
  if (!tracks || tracks.length === 0) return null;

  // Get the src of the currently selected track
  const currentTrackSrc = tracks[currentTrack]?.src;

  return (
    <Box sx={{ width: '100%', marginTop: '30px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        {title}
      </Typography>
      <TextField
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search music..."
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mb: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 1, input: { color: '#fff' } }}
        InputProps={{ style: { color: '#fff' } }}
      />
      <Box 
        sx={{ 
          flex: 1, 
          minHeight: 0, 
          overflowY: 'auto', 
          maxHeight: '350px',
          '::-webkit-scrollbar': { width: '8px', background: 'transparent' },
          '::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.08)', borderRadius: '8px' },
          'scrollbarColor': 'rgba(255,255,255,0.08) transparent',
          'scrollbarWidth': 'thin'
        }}
      >
        <List>
          {filteredTracks.map((track, idx) => {
            const trackIndex = tracks.findIndex(t => t.src === track.src);
            // Use a unique key: prefer src, fallback to index if not present
            const key = track.src ? track.src : `track-${idx}`;
            return (
              <ListItemButton
                key={key}
                selected={currentTrackSrc === track.src}
                onClick={() => setCurrentTrack(trackIndex)}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText primary={track.title} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      {/* Drop Area */}
      {allowDrop && (
        <Box
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
          onDrop={e => {
            e.preventDefault();
            setDragActive(false);
            if (onDropFiles) onDropFiles(e.dataTransfer.files);
          }}
          sx={{
            mt: 2,
            p: 2,
            border: dragActive ? '2px solid #00bcd4' : '2px dashed #fff',
            borderRadius: 2,
            textAlign: 'center',
            color: dragActive ? '#00bcd4' : '#fff',
            background: dragActive ? 'rgba(0,188,212,0.08)' : 'rgba(255,255,255,0.04)',
            fontWeight: 500,
            fontSize: 15,
            transition: 'all 0.2s',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {dragActive ? 'Drop audio files here to add to playlist' : 'Drag & drop audio files here to add to playlist'}
        </Box>
      )}
    </Box>
  );
};

export default Playlist;