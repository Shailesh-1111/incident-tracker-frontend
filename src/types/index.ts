export type Severity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
export type Status = 'OPEN' | 'MITIGATED' | 'RESOLVED';

export interface Incident {
    id: string;
    title: string;
    service: string;
    severity: Severity;
    status: Status;
    owner?: string | null;
    summary?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IncidentFilters {
    status?: Status;
    severity?: Severity;
    search?: string;
    page: number;
    pageSize: number;
    sortBy: keyof Incident;
    sortOrder: 'asc' | 'desc';
}

export interface CreateIncidentDto {
    title: string;
    service: string;
    severity: Severity;
    status?: Status;
    owner?: string;
    summary?: string;
}

export interface UpdateIncidentDto extends Partial<CreateIncidentDto> { }

export interface IncidentResponse {
    data: Incident[];
    meta: {
        limit: number;
        nextCursor?: string;
        totalCount: number;
        totalPages: number;
    };
}

export interface IncidentCounts {
    openCount: number;
    activeSev1Count: number;
    totalCount: number;
}

export interface IncidentFilterOptions {
    services: string[];
    severities: Severity[];
    statuses: Status[];
}
