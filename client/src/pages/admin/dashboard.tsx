import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServiceRecord, User } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState<{ startDate?: string; endDate?: string }>({});
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Check if user is admin/staff
  const { data: authData, isLoading: authLoading, isError: authError } = useQuery({
    queryKey: ['/api/auth-status'],
    queryFn: getQueryFn({ on401: 'throw' }),
    retry: false,
  });
  
  // Fetch service records
  const { data: serviceRecords, isLoading: recordsLoading, isError: recordsError, refetch: refetchRecords } = useQuery({
    queryKey: ['/api/admin/service-records', statusFilter, dateFilter],
    queryFn: async () => {
      let url = '/api/admin/service-records';
      const params = new URLSearchParams();
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      if (dateFilter.startDate) {
        params.append('startDate', dateFilter.startDate);
      }
      
      if (dateFilter.endDate) {
        params.append('endDate', dateFilter.endDate);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await apiRequest('GET', url);
      if (!response.ok) {
        throw new Error('Failed to fetch service records');
      }
      
      return await response.json();
    },
    enabled: !!authData?.authenticated && (authData?.user?.role === 'admin' || authData?.user?.role === 'staff'),
  });
  
  // Fetch unassigned service records
  const { data: unassignedRecords, isLoading: unassignedLoading, isError: unassignedError, refetch: refetchUnassigned } = useQuery({
    queryKey: ['/api/admin/unassigned-service-records'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/unassigned-service-records');
      if (!response.ok) {
        throw new Error('Failed to fetch unassigned records');
      }
      
      return await response.json();
    },
    enabled: !!authData?.authenticated && (authData?.user?.role === 'admin' || authData?.user?.role === 'staff'),
  });
  
  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading } = useQuery({
    queryKey: ['/api/admin/staff'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff members');
      }
      
      return await response.json();
    },
    enabled: !!authData?.authenticated && (authData?.user?.role === 'admin' || authData?.user?.role === 'staff'),
  });
  
  // Assign staff to service record
  const assignStaff = async (recordId: number, staffId: number) => {
    try {
      const response = await apiRequest('PATCH', `/api/admin/service-records/${recordId}`, {
        assignedStaffId: staffId
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign staff');
      }
      
      toast({
        title: "Staff Assigned",
        description: "Staff member has been assigned to this service",
      });
      
      // Refetch data
      refetchRecords();
      refetchUnassigned();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Update service record status
  const updateStatus = async (recordId: number, status: string) => {
    try {
      const response = await apiRequest('PATCH', `/api/admin/service-records/${recordId}`, {
        status
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      toast({
        title: "Status Updated",
        description: `Service status updated to ${status}`,
      });
      
      // Refetch data
      refetchRecords();
      refetchUnassigned();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Filter service records by search term
  const filteredRecords = serviceRecords?.filter((record: ServiceRecord) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      record.id.toString().includes(searchLower) ||
      record.userId.toString().includes(searchLower) ||
      record.propertyId.toString().includes(searchLower) ||
      record.serviceType.toLowerCase().includes(searchLower) ||
      record.status.toLowerCase().includes(searchLower)
    );
  });
  
  // Handle auth errors (redirect non-admin users)
  useEffect(() => {
    if (authError || (authData && !authData.authenticated)) {
      setLocation('/auth');
      toast({
        title: "Access Denied",
        description: "You need to login with admin privileges to access this page",
        variant: "destructive",
      });
    } else if (authData?.authenticated && authData.user.role !== 'admin' && authData.user.role !== 'staff') {
      setLocation('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive",
      });
    }
  }, [authError, authData, setLocation, toast]);
  
  // Render loading state
  if (authLoading || !authData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Checking permission...</span>
      </div>
    );
  }
  
  // Render admin dashboard
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        {/* All Services Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Service Records</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by ID, user, etc."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateFilter.startDate || ''}
                    onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateFilter.endDate || ''}
                    onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recordsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading records...</span>
                </div>
              ) : recordsError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Failed to load service records. Please try again.</p>
                </div>
              ) : filteredRecords?.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record: ServiceRecord) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.id}</TableCell>
                          <TableCell>{record.userId}</TableCell>
                          <TableCell>{record.serviceType}</TableCell>
                          <TableCell>{formatDate(new Date(record.scheduledDate))}</TableCell>
                          <TableCell>
                            <Badge variant={
                              record.status === 'completed' ? 'default' :
                              record.status === 'scheduled' ? 'default' :
                              'destructive'
                            }>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.assignedStaffId ? record.assignedStaffId : 'Unassigned'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {record.status === 'scheduled' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateStatus(record.id, 'completed')}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" /> Complete
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateStatus(record.id, 'cancelled')}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" /> Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2" />
                  <p>No service records found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Unassigned Services Tab */}
        <TabsContent value="unassigned">
          <Card>
            <CardHeader>
              <CardTitle>Unassigned Service Records</CardTitle>
            </CardHeader>
            <CardContent>
              {unassignedLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading unassigned records...</span>
                </div>
              ) : unassignedError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Failed to load unassigned records. Please try again.</p>
                </div>
              ) : unassignedRecords?.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Assign To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unassignedRecords.map((record: ServiceRecord) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.id}</TableCell>
                          <TableCell>{record.userId}</TableCell>
                          <TableCell>{record.serviceType}</TableCell>
                          <TableCell>{formatDate(new Date(record.scheduledDate))}</TableCell>
                          <TableCell>
                            <Select onValueChange={(value) => assignStaff(record.id, parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select staff" />
                              </SelectTrigger>
                              <SelectContent>
                                {staffLoading ? (
                                  <SelectItem value="" disabled>Loading staff...</SelectItem>
                                ) : staffMembers?.length > 0 ? (
                                  staffMembers.map((staff: User) => (
                                    <SelectItem key={staff.id} value={staff.id.toString()}>
                                      {staff.firstName} {staff.lastName}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="" disabled>No staff available</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>No unassigned service records found. All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Services</span>
                    <span className="font-bold">{serviceRecords?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Scheduled</span>
                    <span className="font-bold">{serviceRecords?.filter((r: ServiceRecord) => r.status === 'scheduled').length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-bold">{serviceRecords?.filter((r: ServiceRecord) => r.status === 'completed').length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cancelled</span>
                    <span className="font-bold">{serviceRecords?.filter((r: ServiceRecord) => r.status === 'cancelled').length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Staff Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Loading staff data...</span>
                    </div>
                  ) : staffMembers?.length > 0 ? (
                    staffMembers.map((staff: User) => {
                      const assignedCount = serviceRecords?.filter(r => r.assignedStaffId === staff.id).length || 0;
                      
                      return (
                        <div key={staff.id} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{staff.firstName} {staff.lastName}</span>
                          <span className="font-bold">{assignedCount} services</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No staff members found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordsLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Loading service data...</span>
                    </div>
                  ) : serviceRecords?.length > 0 ? (
                    (() => {
                      const serviceTypes: Record<string, number> = {};
                      
                      serviceRecords.forEach((record: ServiceRecord) => {
                        if (!serviceTypes[record.serviceType]) {
                          serviceTypes[record.serviceType] = 0;
                        }
                        serviceTypes[record.serviceType]++;
                      });
                      
                      return Object.entries(serviceTypes).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{type}</span>
                          <span className="font-bold">{count}</span>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No service data available.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}