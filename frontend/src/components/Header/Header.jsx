import React, { useState } from 'react';
import './Header.css';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { login } from '../../utils/api';
import { isAuthTokenValid, removeAuthTokenFromCookies } from '../../utils/cookies';

function Header() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    login(username, password).then(response => {
      handleClose();
      window.location.reload();
    }).catch(error => {
      console.error(error);
    });
  };

  const handleLogout = () => {
    removeAuthTokenFromCookies();
    window.location.reload();
  };

  return (
    <header>
      <h1>Foq!</h1>

      {isAuthTokenValid() ? (
        <IconButton
          sx={{ color: 'red' }} 
          aria-label="logout"
          onClick={() => {
            handleLogout();
          }}
        >
          <LogoutIcon />
        </IconButton>
      ) : (
        <IconButton
          color="inherit"
          aria-label="login"
          onClick={() => {
            handleClickOpen();
          }}
        >
          <LoginIcon />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Login
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    </header>
  );
}

export default Header;