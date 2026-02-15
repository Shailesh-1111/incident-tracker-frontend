import { useState } from 'react';
import type { ReactNode, FC } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box, IconButton, Typography, useMediaQuery, useTheme, Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon sx={{ mr: 1.5 }} />, path: '/' },
        { text: 'New Incident', icon: <AddCircleOutlineIcon sx={{ mr: 1.5 }} />, path: '/create' },
    ];

    const SidebarContent = (
        <>
            <div className="layout-sidebar-header">
                <Typography variant="h6" className="layout-logo">
                    IncidentTracker
                </Typography>
            </div>
            <nav className="layout-nav">
                {navItems.map((item) => (
                    <RouterLink
                        key={item.text}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => isMobile && setMobileOpen(false)}
                    >
                        {item.icon}
                        {item.text}
                    </RouterLink>
                ))}
            </nav>
        </>
    );

    return (
        <div className="layout-root">
            {/* Sidebar */}
            <aside className={`layout-sidebar ${mobileOpen ? 'open' : ''}`}>
                {SidebarContent}
            </aside>

            {/* Backdrop for mobile */}
            {isMobile && mobileOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1150 }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="layout-main">
                <header className="layout-header">
                    <Box display="flex" alignItems="center">
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                            {navItems.find(i => i.path === location.pathname)?.text || 'Incident Tracker'}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>U</Avatar>
                    </Box>
                </header>

                <div className="layout-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
