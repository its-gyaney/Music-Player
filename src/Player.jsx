

import React, { useRef, useState } from 'react';
import { Box, Slider, IconButton, Typography } from '@mui/material';
import { FaStepBackward, FaPlay, FaPause, FaStepForward, FaVolumeUp } from 'react-icons/fa';

const Player = ({ currentTrack, setCurrentTrack, playOnSelect, setPlayOnSelect, tracks }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const handleVolumeChange = (e, value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setProgress(0);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
    setProgress(0);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSliderChange = (e, value) => {
    audioRef.current.currentTime = value;
    setProgress(value);
  };


  React.useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      audioRef.current.volume = volume;
    }
    if (playOnSelect) {
      setPlayOnSelect(false);
    }
    // eslint-disable-next-line
  }, [currentTrack]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  if (!tracks || tracks.length === 0) return null;
  return (
    <Box sx={{
      width: '100vw',
      position: 'fixed',
      left: 0,
      bottom: 0,
      background: 'linear-gradient(to right, #00bcd4, #3a9bdc)',
      zIndex: 1200,
      boxShadow: '0 -8px 32px 0 rgba(0,0,0,0.35), 0 -2px 8px 0 rgba(0,188,212,0.15)',
      px: 3,
      py: 1.5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#fff', textAlign: 'center', width: '100%' }}>{tracks[currentTrack]?.title}</Typography>
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        style={{ display: 'none' }}
      />
      <Box sx={{ width: '100%', maxWidth: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <IconButton sx={{ color: 'white' }} onClick={handlePrev}>
            <FaStepBackward />
          </IconButton>
          <IconButton sx={{ color: 'white' }} onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </IconButton>
          <IconButton sx={{ color: 'white' }} onClick={handleNext}>
            <FaStepForward />
          </IconButton>
        </Box>
        {/* Time Slider and Time */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography sx={{ color: '#fff', fontSize: 13, minWidth: 40, textAlign: 'right' }}>{formatTime(progress)}</Typography>
          <Slider
            value={progress}
            min={0}
            max={duration || 1}
            onChange={handleSliderChange}
            sx={{ flex: 1, mx: 1, color: '#fff' }}
          />
          <Typography sx={{ color: '#fff', fontSize: 13, minWidth: 40, textAlign: 'left' }}>{formatTime(duration)}</Typography>
        </Box>
        {/* Volume */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, minWidth: 100 }}>
          <FaVolumeUp style={{ color: '#fff', fontSize: 18 }} />
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            sx={{ width: 70, color: '#fff' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

function formatTime(time) {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default Player;
