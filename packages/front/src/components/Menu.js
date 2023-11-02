import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Menu() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    My SPA
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Menu;