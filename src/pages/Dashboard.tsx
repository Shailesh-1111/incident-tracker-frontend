import { useEffect, useState } from 'react';
import {
    Typography, Button, Box, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    IconButton, Tooltip,
    FormControl, InputLabel, Select, MenuItem, Skeleton, TextField, InputAdornment
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getIncidents, getCounts, getFilters } from '../services/incidentService';
import type { Incident, Severity, Status } from '../types';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(false);

    const [cursors, setCursors] = useState<string[]>([]);
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Sorting State
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState<keyof Incident>('createdAt');

    // Filtering State
    const [statusFilter, setStatusFilter] = useState<Status | ''>('');
    const [severityFilter, setSeverityFilter] = useState<Severity | ''>('');

    const [stats, setStats] = useState({ total: 0, open: 0, activeSev1: 0 });

    const [statsLoading, setStatsLoading] = useState(true);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Service Filter State
    const [serviceFilter, setServiceFilter] = useState('');
    const [services, setServices] = useState<string[]>([]);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            // Reset pagination on new search
            setCursors([]);
            setCurrentCursor(undefined);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Fetch filters and stats on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            setStatsLoading(true);
            try {
                const [filtersData, countsData] = await Promise.all([
                    getFilters(),
                    getCounts({})
                ]);
                setServices(filtersData.services);
                setStats({
                    total: countsData.totalCount,
                    open: countsData.openCount,
                    activeSev1: countsData.activeSev1Count
                });
            } catch (error) {
                console.error('Failed to fetch initial data', error);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch stats when filters change
    useEffect(() => {
        const fetchStats = async () => {
            // Optional: setStatsLoading(true) here if we want skeletons on filter change too
            // But usually for filters we might just update the numbers. 
            // Let's keep it simple and only do it for initial load or if explicitly desired.
            try {
                const countsData = await getCounts({
                    status: statusFilter || undefined,
                    severity: severityFilter || undefined,
                    search: debouncedSearch || undefined,
                    service: serviceFilter || undefined
                });
                setStats(prev => ({
                    ...prev,
                    open: countsData.openCount,
                    activeSev1: countsData.activeSev1Count
                }));
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, [statusFilter, severityFilter, debouncedSearch, serviceFilter]);

    // Fetch Incidents
    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const data = await getIncidents({
                limit: rowsPerPage, // Use limit instead of page/size
                status: statusFilter || undefined,
                severity: severityFilter || undefined,
                sort: orderBy,
                order: order,
                search: debouncedSearch || undefined,
                service: serviceFilter || undefined,
                cursor: currentCursor // Pass current cursor
            });
            setIncidents(data.data);
            setNextCursor(data.meta.nextCursor);
            // Update total stat from meta
            if (data.meta.totalCount !== undefined) {
                setStats(prev => ({ ...prev, total: data.meta.totalCount }));
            }
            if (data.meta.totalPages !== undefined) {
                setTotalPages(data.meta.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch incidents', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCursor, rowsPerPage, order, orderBy, statusFilter, severityFilter, debouncedSearch, serviceFilter]);

    // Pagination Handlers
    const handleNextPage = () => {
        if (nextCursor) {
            setCursors([...cursors, currentCursor || '']); // Push current to stack (undefined as '' for initial)
            setCurrentCursor(nextCursor);
        }
    };

    const handlePreviousPage = () => {
        if (cursors.length > 0) {
            const newCursors = [...cursors];
            const prevCursor = newCursors.pop(); // Pop last cursor
            setCursors(newCursors);
            setCurrentCursor(prevCursor === '' ? undefined : prevCursor);
        }
    };

    const handleRequestSort = (property: keyof Incident) => {
        const isAsc = orderBy === property && order === 'asc';
        const isDesc = orderBy === property && order === 'desc';

        if (isAsc) {
            setOrder('desc');
            setOrderBy(property);
        } else if (isDesc) {
            setOrder('desc');
            setOrderBy('createdAt');
        } else {
            setOrder('asc');
            setOrderBy(property);
        }

        // Reset pagination on sort change
        setCursors([]);
        setCurrentCursor(undefined);
    };

    const handleFilterChange = (filterType: 'status' | 'severity' | 'service', value: string) => {
        if (filterType === 'status') setStatusFilter(value as Status | '');
        if (filterType === 'severity') setSeverityFilter(value as Severity | '');
        if (filterType === 'service') setServiceFilter(value);

        // Reset pagination on filter change
        setCursors([]);
        setCurrentCursor(undefined);
    };

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(parseInt(event.target.value as string, 10));
        setCursors([]);
        setCurrentCursor(undefined);
    };



    return (
        <Box sx={{ width: '100%', mb: 2, minHeight: '100vh' }}>
            {/* Header Stats & Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="text.primary">
                        Incidents
                    </Typography>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {statsLoading ? (
                            <>
                                <Skeleton variant="rounded" width={80} height={24} />
                                <Skeleton variant="rounded" width={80} height={24} />
                                <Skeleton variant="rounded" width={100} height={24} />
                            </>
                        ) : (
                            <>
                                <Chip label={`Total: ${stats.total} `} variant="outlined" size="small" />
                                <Chip label={`Open: ${stats.open} `} color="success" variant="outlined" size="small" />
                                <Chip label={`Active Sev1: ${stats.activeSev1} `} color="error" variant="outlined" size="small" />
                            </>
                        )}
                    </div>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create')}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    New Incident
                </Button>
            </Box>

            {/* Filters Bar */}
            <Box
                display="flex"
                gap={2}
                mb={3}
                p={2}
                bgcolor="white"
                borderRadius={2}
                boxShadow="0px 2px 4px rgba(0,0,0,0.02)"
                border="1px solid #f1f5f9"
                flexWrap="wrap"
                alignItems="center"
            >
                <TextField
                    placeholder="Search title, service..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1, minWidth: '200px' }}
                />

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel id="service-select-label">Service</InputLabel>
                    <Select
                        labelId="service-select-label"
                        value={serviceFilter}
                        label="Service"
                        onChange={(e) => handleFilterChange('service', e.target.value)}
                    >
                        <MenuItem value=""><em>All Services</em></MenuItem>
                        {services.map((service) => (
                            <MenuItem key={service} value={service}>{service}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e: SelectChangeEvent) => handleFilterChange('status', e.target.value)}
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value="OPEN">Open</MenuItem>
                        <MenuItem value="MITIGATED">Mitigated</MenuItem>
                        <MenuItem value="RESOLVED">Resolved</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Severity</InputLabel>
                    <Select
                        value={severityFilter}
                        label="Severity"
                        onChange={(e: SelectChangeEvent) => handleFilterChange('severity', e.target.value)}
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value="SEV1">Sev 1</MenuItem>
                        <MenuItem value="SEV2">Sev 2</MenuItem>
                        <MenuItem value="SEV3">Sev 3</MenuItem>
                        <MenuItem value="SEV4">Sev 4</MenuItem>
                    </Select>
                </FormControl>

                <Tooltip title="Refresh">
                    <IconButton onClick={fetchIncidents} size="small">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Incidents Table */}
            <TableContainer component={Box} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} aria-label="incidents table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell sortDirection={orderBy === 'id' ? order : false} sx={{ width: '8%', fontWeight: 600, color: '#64748b' }}>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    ID
                                    <FilterListIcon fontSize="small" sx={{ opacity: 0.3, ml: 0.5, fontSize: 16 }} />
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'title' ? order : false} sx={{ width: '25%', fontWeight: 600, color: '#64748b' }}>
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleRequestSort('title')}
                                >
                                    Title
                                    <FilterListIcon fontSize="small" sx={{ opacity: 0.3, ml: 0.5, fontSize: 16 }} />
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'severity' ? order : false} sx={{ width: '10%', fontWeight: 600, color: '#64748b' }}>
                                <TableSortLabel
                                    active={orderBy === 'severity'}
                                    direction={orderBy === 'severity' ? order : 'asc'}
                                    onClick={() => handleRequestSort('severity')}
                                >
                                    Severity
                                    <FilterListIcon fontSize="small" sx={{ opacity: 0.3, ml: 0.5, fontSize: 16 }} />
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'status' ? order : false} sx={{ width: '10%', fontWeight: 600, color: '#64748b' }}>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                    <FilterListIcon fontSize="small" sx={{ opacity: 0.3, ml: 0.5, fontSize: 16 }} />
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ width: '12%', fontWeight: 600, color: '#64748b' }}>Service</TableCell>
                            <TableCell sx={{ width: '12%', fontWeight: 600, color: '#64748b' }}>Owner</TableCell>
                            <TableCell sortDirection={orderBy === 'createdAt' ? order : false} sx={{ width: '15%', fontWeight: 600, color: '#64748b' }}>
                                <TableSortLabel
                                    active={orderBy === 'createdAt'}
                                    direction={orderBy === 'createdAt' ? order : 'asc'}
                                    onClick={() => handleRequestSort('createdAt')}
                                >
                                    Created
                                    <FilterListIcon fontSize="small" sx={{ opacity: 0.3, ml: 0.5, fontSize: 16 }} />
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ width: '8%', fontWeight: 600, color: '#64748b' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from(new Array(rowsPerPage)).map((_, index) => (
                                <TableRow key={index} sx={{ height: 53 }}>
                                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                                    <TableCell><Skeleton variant="text" width="90%" /></TableCell>
                                    <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                                    <TableCell align="right"><Skeleton variant="circular" width={24} height={24} sx={{ ml: 'auto' }} /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            incidents.map((incident) => (
                                <TableRow
                                    key={incident.id}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                    onClick={() => navigate(`/ incidents / ${incident.id} `)}
                                >
                                    <TableCell component="th" scope="row" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                                        {incident.id}
                                    </TableCell>
                                    <TableCell>{incident.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={incident.severity}
                                            size="small"
                                            className={`severity - ${incident.severity.toLowerCase()} `}
                                            sx={{ fontWeight: 600, minWidth: 60 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={incident.status}
                                            size="small"
                                            className={`status - chip - ${incident.status.toLowerCase()} `}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>{incident.service}</TableCell>
                                    <TableCell>
                                        {incident.owner ? (
                                            <Chip label={incident.owner} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">Unassigned</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(incident.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ (\d{4})$/, ', $1')}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/ incidents / ${incident.id} `); }}>
                                            <ArrowForwardIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        {!loading && incidents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No incidents found matching your criteria.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Cursor-Based Pagination Controls */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                    borderTop="1px solid #f1f5f9"
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="caption" color="text.secondary">
                            Rows per page:
                        </Typography>
                        <Select
                            value={rowsPerPage.toString()}
                            onChange={handleChangeRowsPerPage}
                            size="small"
                            variant="standard"
                            disableUnderline
                            sx={{ fontSize: '0.875rem' }}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                        </Select>
                        {loading ? (
                            <Skeleton variant="text" width={150} height={20} />
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                Showing {stats.total === 0 ? 0 : (cursors.length * rowsPerPage) + 1}-{Math.min((cursors.length + 1) * rowsPerPage, stats.total || 0)} of {stats.total || 0}
                            </Typography>
                        )}
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography variant="caption" color="text.secondary" mr={2}>
                            Page {cursors.length + 1} of {totalPages || 1}
                        </Typography>
                        <Tooltip title="Previous Page">
                            <span>
                                <IconButton
                                    onClick={handlePreviousPage}
                                    disabled={cursors.length === 0 || loading}
                                    size="small"
                                    sx={{ mr: 1, border: '1px solid #e2e8f0', borderRadius: 1 }}
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Next Page">
                            <span>
                                <IconButton
                                    onClick={handleNextPage}
                                    disabled={!nextCursor || loading}
                                    size="small"
                                    sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
            </TableContainer>
        </Box>
    );
};

export default Dashboard;
