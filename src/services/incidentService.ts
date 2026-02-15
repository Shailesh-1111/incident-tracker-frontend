import api from './api';
import type { CreateIncidentDto, Incident, IncidentResponse, UpdateIncidentDto, IncidentCounts, IncidentFilterOptions } from '../types';

export const getIncidents = async (params: any): Promise<IncidentResponse> => {
    const response = await api.get<IncidentResponse>('/incidents', { params });
    return response.data;
};

export const getCounts = async (params: any): Promise<IncidentCounts> => {
    const response = await api.get<IncidentCounts>('/incidents/counts', { params });
    return response.data;
};

export const getFilters = async (): Promise<IncidentFilterOptions> => {
    const response = await api.get<IncidentFilterOptions>('/incidents/filters');
    return response.data;
};

export const getIncidentById = async (id: string): Promise<Incident> => {
    const response = await api.get<Incident>(`/incidents/${id}`);
    return response.data;
};

export const createIncident = async (data: CreateIncidentDto): Promise<Incident> => {
    const response = await api.post<Incident>('/incidents', data);
    return response.data;
};

export const updateIncident = async (id: string, data: UpdateIncidentDto): Promise<Incident> => {
    const response = await api.patch<Incident>(`/incidents/${id}`, data);
    return response.data;
};

export const deleteIncident = async (id: string): Promise<void> => {
    await api.delete(`/incidents/${id}`);
};
