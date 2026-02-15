import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField, Button, MenuItem, Typography, Box, Alert,
    CircularProgress, Chip, Skeleton, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Link, useNavigate } from 'react-router-dom';
import { createIncident, getFilters } from '../services/incidentService';
import type { CreateIncidentDto } from '../types';
import './IncidentDetail.css';

const CreateIncident = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<string[]>([]);
    const [initLoading, setInitLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<CreateIncidentDto>({
        defaultValues: {
            title: '',
            service: '',
            severity: 'SEV4',
            status: 'OPEN',
            summary: '',
            owner: ''
        }
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await getFilters();
                setServices(data.services);
            } catch (err) {
                console.error('Failed to fetch initial data', err);
            } finally {
                setInitLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const onSubmit = async (data: CreateIncidentDto) => {
        setLoading(true);
        setError(null);
        try {
            await createIncident(data);
            navigate('/');
        } catch (err: any) {
            console.error('Failed to create incident', err);
            setError(err.response?.data?.error || 'Failed to create incident');
        } finally {
            setLoading(false);
        }
    };

    const renderSkeleton = () => (
        <div className="incident-detail-container">
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <header className="incident-header">
                    <Box>
                        <Skeleton variant="rectangular" width={180} height={20} sx={{ borderRadius: '4px' }} />
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
                    </Box>
                </header>
                <div style={{ padding: '8px 12px', margin: '8px 0 16px 0', borderRadius: '6px' }}>
                    <Skeleton variant="rectangular" width="60%" height={20} sx={{ borderRadius: '4px' }} />
                </div>
                <div className="main-content" style={{ display: 'flex' }}>
                    {/* Left Panel: Sidebar Details */}
                    <div className="sidebar-panel" style={{ width: '350px', flexShrink: 0, borderRight: '1px solid #dfe1e6' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="field-group">
                                <Skeleton variant="rectangular" width={70} height={12} sx={{ mb: 1, borderRadius: '3px' }} />
                                <div style={{ padding: '4px 0', borderRadius: '6px' }}>
                                    <Skeleton variant="rectangular" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel: Content */}
                    <div className="content-panel" style={{ flex: 1 }}>
                        <Skeleton variant="rectangular" width={100} height={15} sx={{ mb: 2, borderRadius: '4px' }} />
                        <div style={{ padding: '0', borderRadius: '6px', minHeight: 200 }}>
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

    if (initLoading) return renderSkeleton();

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
                            <span className="incident-id">New</span>
                        </div>
                    </Box>
                    <Box display="flex" gap={1}>
                        <Button
                            variant="text"
                            color="inherit"
                            onClick={() => navigate('/')}
                            disabled={loading}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            {loading ? 'Creating...' : 'Create Incident'}
                        </Button>
                    </Box>
                </header>

                {error && (
                    <Alert severity="error" sx={{ mx: 2, mt: 1, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

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
                            error={!!errors.title}
                            helperText={errors.title?.message}
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
                                        error={!!errors.service}
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
                                rules={{ required: 'Severity is required' }}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: -0.5 }}
                                    >
                                        <FormControlLabel
                                            value="SEV1"
                                            control={<Radio size="small" sx={{ color: '#dc2626', '&.Mui-checked': { color: '#dc2626' } }} />}
                                            label={<Chip label="SEV1 (Critical)" size="small" className="severity-sev1" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />}
                                        />
                                        <FormControlLabel
                                            value="SEV2"
                                            control={<Radio size="small" sx={{ color: '#ea580c', '&.Mui-checked': { color: '#ea580c' } }} />}
                                            label={<Chip label="SEV2 (High)" size="small" className="severity-sev2" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />}
                                        />
                                        <FormControlLabel
                                            value="SEV3"
                                            control={<Radio size="small" sx={{ color: '#ca8a04', '&.Mui-checked': { color: '#ca8a04' } }} />}
                                            label={<Chip label="SEV3 (Medium)" size="small" className="severity-sev3" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />}
                                        />
                                        <FormControlLabel
                                            value="SEV4"
                                            control={<Radio size="small" sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
                                            label={<Chip label="SEV4 (Low)" size="small" className="severity-sev4" sx={{ fontWeight: 600, cursor: 'pointer', height: 24 }} />}
                                        />
                                    </RadioGroup>
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
                            <div className="field-label">Assigned To (optional)</div>
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
                                    minRows={12}
                                    placeholder="Describe the impact and current status..."
                                    variant="standard"
                                    className="editable-field description-area"
                                    InputProps={{ disableUnderline: true }}
                                    sx={{ borderRadius: '6px' }}
                                />
                            )}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateIncident;
