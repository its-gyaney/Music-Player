import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton, Slider } from '@mui/material';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';

function Player({ track, currentTrack, setCurrentTrack, tracks, playOnSelect, setPlayOnSelect }) {
  const [volume, setVolume] = useState(1);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  // Seek handler for time slider
  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time in mm:ss
  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Get the current track title and src
  const trackObj = tracks && tracks.length > 0 ? tracks[currentTrack] : null;
  const src = trackObj ? `http://127.0.0.1:8000/play/${encodeURIComponent(trackObj.title)}` : '';


  // Play on track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTrack]);

  // Auto-play if playOnSelect is true
  useEffect(() => {
    if (playOnSelect && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      if (setPlayOnSelect) setPlayOnSelect(false);
    }
    // eslint-disable-next-line
  }, [playOnSelect, currentTrack]);

  // Play when isPlaying is set to true
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handlePrev = () => {
    if (tracks && tracks.length > 0) {
      setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  const handleNext = () => {
    if (tracks && tracks.length > 0) {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    }
  };

  const handleEnded = () => {
    handleNext();
    setIsPlaying(true); // auto-play next
  };

  if (!trackObj) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '95px',
        background: '#21a9d9',
        boxShadow: 6,
        zIndex: 1200,
        px: { xs: 1, sm: 4 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        }}>

        <Typography variant="h6" sx={{ mb: 0, color: '#fff', flex: 1, minWidth: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{trackObj.title}</Typography>

        {/* Time Lapse */}
        <Box sx={{
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',  
           width: '100%' 
           }}>

          {/* Current Time */}
          <Box sx={{ color: '#fff', minWidth: 48, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 15, mr: 1 }}>
            {formatTime(currentTime)}
          </Box>

          {/* Time Slider */}
          <Box sx={{ width: 180, opacity: 0.8, cursor: 'pointer' }}>
            <Slider
            min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              style={{ width: '100%' }}
              disabled={duration === 0}
            />
          </Box>

          {/* Estimated Time */}
          <Box sx={{ color: '#fff', minWidth: 48, textAlign: 'left', fontVariantNumeric: 'tabular-nums', fontSize: 15, ml: 1 }}>
            {formatTime(duration)}
          </Box>

          {/* Controls */}
          <IconButton onClick={handlePrev} sx={{ color: '#fff', ml: 2 }}><FaStepBackward /></IconButton>
          <IconButton onClick={handlePlayPause} sx={{ color: '#fff', mx: 2 }}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </IconButton>
          <IconButton onClick={handleNext} sx={{ color: '#fff' }}><FaStepForward /></IconButton>
          <IconButton sx={{ color: '#fff', ml: 2 }}><FaVolumeUp /></IconButton>
          
          {/* Volume Slider */}
          <Box sx={{ width: 100, opacity: 0.8, cursor: 'pointer', ml: 1 }}>
            <Slider
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={e => setVolume(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </Box>
        </Box>
        <audio
          ref={audioRef}
          src={src}
          onEnded={handleEnded}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={e => setDuration(e.target.duration || 0)}
          style={{ display: 'none' }}
        />
      </Box>
    </Box>
  );
}

export default Player;