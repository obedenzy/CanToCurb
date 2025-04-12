import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, MapPinIcon, Truck, Recycle, Settings, CreditCard, BellRing, Clock, MessageSquare } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is authenticated
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['/api/auth-status'],
    retry: false,
  });

  // Get user data
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ['/api/user'],
    enabled: !!authData?.authenticated,
  });

  // If not authenticated, redirect to login
  if (!authLoading && !authData?.authenticated) {
    return <Redirect to="/login" />;
  }

  const isLoading = authLoading || userDataLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-xl">Loading your dashboard...</span>
      </div>
    );
  }

  const { user, address, property, subscription } = userData || {};
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  // Get next service date (example calculation)
  const today = new Date();
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const trashDayIndex = dayOfWeek.indexOf(property?.trashDay || "");
  
  let nextServiceDate = new Date();
  if (trashDayIndex !== -1) {
    const currentDayIndex = today.getDay();
    const daysUntilTrashDay = (trashDayIndex - currentDayIndex + 7) % 7;
    nextServiceDate.setDate(today.getDate() + daysUntilTrashDay);
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - TrashMonkey</title>
        <meta name="description" content="Manage your TrashMonkey trash can service." />
      </Helmet>
      
      <div className="bg-neutral py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary">Welcome, {fullName}!</h1>
            <p className="text-gray-600">Manage your trash service and account details</p>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Next Service</CardTitle>
                    <CardDescription>Your upcoming trash collection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{formatDate(nextServiceDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>We'll take your bins out the evening before</span>
                    </div>
                    <Button className="mt-4 w-full">Modify Schedule</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Service Address</CardTitle>
                    <CardDescription>Where we service your bins</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-2">
                      <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{address?.street}</p>
                        <p className="text-gray-600">{address?.city}, {address?.state} {address?.zip}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full">Update Address</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Account Status</CardTitle>
                    <CardDescription>Your subscription details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Plan:</span>
                      <Badge>{subscription?.planId || "Starter"}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        {subscription?.status || "Active"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span>Monthly</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between font-medium">
                      <span>Next Billing:</span>
                      <span>{subscription?.currentPeriodEnd ? formatDate(new Date(subscription.currentPeriodEnd)) : "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Trash & Recycling Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral p-4 rounded-lg flex items-start space-x-3">
                        <Truck className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium mb-1">Trash Collection</h4>
                          <p className="text-gray-600 text-sm">Day: <span className="font-medium">{property?.trashDay || "N/A"}</span></p>
                          <p className="text-gray-600 text-sm">Cans: <span className="font-medium">{property?.trashCanCount || 0}</span></p>
                        </div>
                      </div>
                      
                      <div className="bg-neutral p-4 rounded-lg flex items-start space-x-3">
                        <Recycle className="h-6 w-6 text-green-500 mt-1" />
                        <div>
                          <h4 className="font-medium mb-1">Recycling Collection</h4>
                          <p className="text-gray-600 text-sm">Day: <span className="font-medium">{property?.recycleDay || property?.trashDay || "N/A"}</span></p>
                          <p className="text-gray-600 text-sm">Cans: <span className="font-medium">{property?.recycleCanCount || 0}</span></p>
                          {property?.alternatingRecycle && (
                            <Badge variant="outline" className="mt-1 text-xs">Alternating Weeks</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Trash collection completed</p>
                          <p className="text-sm text-gray-500">Your bins were returned to your property</p>
                          <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Payment processed</p>
                          <p className="text-sm text-gray-500">Monthly subscription payment</p>
                          <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <BellRing className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Service notification</p>
                          <p className="text-sm text-gray-500">Your bins have been placed at the curb</p>
                          <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Button className="w-full sm:w-auto" variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Support
                      </Button>
                      <Button className="w-full sm:w-auto" variant="outline">
                        Report an Issue
                      </Button>
                      <Button className="w-full sm:w-auto" variant="outline">
                        View FAQs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Service Schedule</CardTitle>
                  <CardDescription>View and manage your collection schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>The schedule management interface would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>Manage your subscription and payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>The billing management interface would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>The settings interface would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
