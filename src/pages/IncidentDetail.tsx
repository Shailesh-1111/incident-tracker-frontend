import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Typography, TextField, Button, MenuItem, Box, Alert,
    CircularProgress, Chip, IconButton, Tooltip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Skeleton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getIncidentById, updateIncident, deleteIncident, getFilters } from '../services/incidentService';
import type { Incident, UpdateIncidentDto } from '../types';
import './IncidentDetail.css';

const IncidentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [incident, setIncident] = useState<Incident | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<UpdateIncidentDto>();

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [incidentData, filtersData] = await Promise.all([
                    getIncidentById(id),
                    getFilters()
                ]);
                setIncident(incidentData);
                setServices(filtersData.services);
                reset(incidentData as any);
            } catch (err: any) {
                setError('Failed to load incident data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, reset]);

    const onSubmit = async (data: UpdateIncidentDto) => {
        if (!id) return;
        setSaving(true);
        try {
            const updated = await updateIncident(id, data);
            setIncident(updated);
            // Reset form with new data to reset isDirty
            reset(updated as any);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update incident');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!id) return;
        try {
            await deleteIncident(id);
            navigate('/');
        } catch (err: any) {
            setError('Failed to delete incident');
            setOpenDeleteDialog(false);
        }
    };

    if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;

    const renderSkeleton = () => (
        <div className="incident-detail-container">
            {/* Same wrapper structure as the <form> in loaded state */}
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <header className="incident-header">
                    <Box>
                        <Skeleton variant="rectangular" width={180} height={20} sx={{ borderRadius: '4px' }} />
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <Skeleton variant="rectangular" width={130} height={36} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="circular" width={28} height={28} />
                    </Box>
                </header>
                <div className="main-content" style={{ display: 'flex' }}>
                    <div className="sidebar-panel" style={{ width: '350px', flexShrink: 0, borderRight: '1px solid #dfe1e6' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="field-group">
                                <Skeleton variant="rectangular" width={70} height={12} sx={{ mb: 1, borderRadius: '3px' }} />
                                <div style={{ padding: '4px 0', borderRadius: '6px' }}>
                                    <Skeleton variant="rectangular" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="content-panel" style={{ flex: 1 }}>
                        {/* Title skeleton */}
                        <div style={{ marginBottom: 24, borderRadius: '6px' }}>
                            <Skeleton variant="rectangular" width="80%" height={32} sx={{ borderRadius: '4px' }} />
                        </div>

                        {/* Description label */}
                        <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#172b4d', mb: 1.5, mt: 2 }}>
                            <Skeleton variant="rectangular" width={100} height={15} sx={{ borderRadius: '4px' }} />
                        </Typography>

                        {/* Description area */}
                        <div style={{ borderRadius: '6px', minHeight: 200 }}>
                            <Skeleton variant="rectangular" width="100%" height={16} sx={{ mb: 1.5, borderRadius: '4px' }} />
                            <Skeleton variant="rectangular" width="100%" height={16} sx={{ mb: 1.5, borderRadius: '4px' }} />
                            <Skeleton variant="rectangular" width="100%" height={16} sx={{ mb: 1.5, borderRadius: '4px' }} />
                            <Skeleton variant="rectangular" width="95%" height={16} sx={{ mb: 1.5, borderRadius: '4px' }} />
                            <Skeleton variant="rectangular" width="90%" height={16} sx={{ mb: 1.5, borderRadius: '4px' }} />
                            <Skeleton variant="rectangular" width="60%" height={16} sx={{ borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) return renderSkeleton();
    if (!incident) return <Box sx={{ p: 4 }}><Alert severity="warning">Incident not found</Alert></Box>;

    return (
        <div className="incident-detail-container">
            <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <header className="incident-header">
                    <Box>
                        <div className="breadcrumb">
                            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                                <ArrowBackIcon sx={{ fontSize: 16, mr: 0.5 }} /> Projects
                            </Link>
                            <span>/</span>
                            <span>Incidents</span>
                            <span>/</span>
                            <span className="incident-id">{incident.id.substring(0, 8)}...</span>
                        </div>
                    </Box>
                    <Box display="flex" gap={1}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!isDirty && !saving}
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Tooltip title="Delete Incident">
                            <IconButton onClick={handleDeleteClick} color="error" size="small">
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </header>

                {/* Title spans full width */}
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            multiline
                            variant="standard"
                            placeholder="Incident Title"
                            className="editable-field title-input"
                            InputProps={{ disableUnderline: true }}
                            sx={{ mt: 1, mb: 2, borderRadius: '6px', marginLeft: 0 }}
                        />
                    )}
                />

                <div className="main-content">
                    {/* Left Panel: Sidebar Details */}
                    <div className="sidebar-panel">
                        <div className="field-group">
                            <div className="field-label">Affected Service</div>
                            <Controller
                                name="service"
                                control={control}
                                rules={{ required: 'Service is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        variant="standard"
                                        className="editable-field"
                                        InputProps={{ disableUnderline: true }}
                                        SelectProps={{
                                            displayEmpty: true,
                                            renderValue: (selected: any) => {
                                                if (!selected) return <Typography color="text.secondary">Select Service</Typography>;
                                                return (
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <LocalOfferIcon sx={{ fontSize: 16, color: '#5e6c84' }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{selected}</Typography>
                                                    </Box>
                                                );
                                            }
                                        }}
                                    >
                                        {services.map((service) => (
                                            <MenuItem key={service} value={service}>{service}</MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field-label">Severity</div>
                            <Controller
                                name="severity"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        variant="standard"
                                        className="editable-field"
                                        InputProps={{ disableUnderline: true }}
                                        SelectProps={{
                                            renderValue: (selected) => (
                                                <Chip
                                                    label={selected as string}
                                                    size="small"
                                                    className={`severity-${(selected as string).toLowerCase()}`}
                                                    sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }}
                                                />
                                            )
                                        }}
                                    >
                                        <MenuItem value="SEV1">
                                            <Chip label="SEV1 (Critical)" size="small" className="severity-sev1" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />
                                        </MenuItem>
                                        <MenuItem value="SEV2">
                                            <Chip label="SEV2 (High)" size="small" className="severity-sev2" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />
                                        </MenuItem>
                                        <MenuItem value="SEV3">
                                            <Chip label="SEV3 (Medium)" size="small" className="severity-sev3" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />
                                        </MenuItem>
                                        <MenuItem value="SEV4">
                                            <Chip label="SEV4 (Low)" size="small" className="severity-sev4" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />
                                        </MenuItem>
                                    </TextField>
                                )}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field-label">Status</div>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        variant="standard"
                                        className="editable-field"
                                        InputProps={{ disableUnderline: true }}
                                        SelectProps={{
                                            renderValue: (selected) => (
                                                <Chip
                                                    label={selected as string}
                                                    size="small"
                                                    className={`status-chip-${(selected as string).toLowerCase()}`}
                                                    sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }}
                                                />
                                            )
                                        }}
                                    >
                                        <MenuItem value="OPEN">
                                            <Chip label="OPEN" size="small" className="status-chip-open" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />
                                        </MenuItem>
                                        <MenuItem value="MITIGATED">
                                            <Chip label="MITIGATED" size="small" className="status-chip-mitigated" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />
                                        </MenuItem>
                                        <MenuItem value="RESOLVED">
                                            <Chip label="RESOLVED" size="small" className="status-chip-resolved" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />
                                        </MenuItem>
                                    </TextField>
                                )}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field-label">Assignee</div>
                            <Controller
                                name="owner"
                                control={control}
                                render={({ field }) => (
                                    <Box className="editable-field" display="flex" alignItems="center" gap={1} sx={{ marginLeft: 0, width: '100%' }}>
                                        <PersonIcon sx={{ fontSize: 18, color: '#5e6c84' }} />
                                        <TextField
                                            {...field}
                                            fullWidth
                                            variant="standard"
                                            placeholder="Unassigned"
                                            InputProps={{ disableUnderline: true }}
                                            sx={{ '& .MuiInputBase-input': { p: 0 } }}
                                        />
                                    </Box>
                                )}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field-label">Occurred At</div>
                            <Box display="flex" alignItems="center" gap={1} sx={{ p: '4px 8px' }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: '#5e6c84' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(incident.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ (\d{4})$/, ', $1')}
                                </Typography>
                            </Box>
                        </div>
                    </div>

                    {/* Right Panel: Description */}
                    <div className="content-panel">
                        <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#5e6c84', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Description
                        </Typography>
                        <Controller
                            name="summary"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    minRows={8}
                                    placeholder="Add a description..."
                                    variant="standard"
                                    className="editable-field description-area"
                                    InputProps={{ disableUnderline: true }}
                                    sx={{ borderRadius: '6px' }}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describeby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Incident?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this incident? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    );
};

export default IncidentDetail;
