// src/pages/Project.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "convex/react";
import { api } from "../../api.convex";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { Activity, AlertCircle, CheckCircle2, Clock, Database, TrendingUp, RefreshCw, Zap, Eye } from "lucide-react";

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convex query → logs for this project
  const tasks = useQuery(api.task.get, { projectId: String(projectId) }) || [];

  // Fetch project details (from your backend)
  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        { withCredentials: true }
      );
      setProject(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Stats calculation
  const stats = React.useMemo(() => {
    if (!tasks.length) return null;

    const totalRequests = tasks.length;
    const successfulRequests = tasks.filter((log) =>
      log.statusCode?.toString().startsWith("2")
    ).length;
    const errorCount = totalRequests - successfulRequests;
    const avgResponseTime =
      tasks.reduce((acc, log) => acc + (Number(log.responseTime) || 0), 0) /
      totalRequests;

    return {
      totalRequests,
      successfulRequests,
      errorCount,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      successRate: Math.round((successfulRequests / totalRequests) * 100),
    };
  }, [tasks]);

  // Chart data
  const recentLogs = tasks.slice(0, 50);
  const logChartData = recentLogs
    .map((log, index) => ({
      index: index + 1,
      responseTime: Number(log.responseTime) || 0,
      statusCode: log.statusCode,
      timestamp: log.timestamp
        ? new Date(log.timestamp).toLocaleTimeString()
        : "-",
      isError: !log.statusCode?.toString().startsWith("2"),
    }))
    .reverse();

  const operationStats = tasks.reduce((acc, log) => {
    const op = log.operation || "Unknown";
    acc[op] = (acc[op] || 0) + 1;
    return acc;
  }, {});

  const operationChartData = Object.entries(operationStats).map(
    ([operation, count]) => ({
      operation: operation.toUpperCase(),
      count,
      fill:
        operation === "create"
          ? "#eab308"
          : operation === "read"
          ? "#22c55e"
          : operation === "update"
          ? "#3b82f6"
          : operation === "delete"
          ? "#ef4444"
          : "#6b7280",
    })
  );

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="text-zinc-200 text-sm">{`Request #${label}`}</p>
          <p className="text-yellow-400 font-medium">
            {`Response Time: ${payload[0].value}ms`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {project?.name || "Project Dashboard"}
              </h1>
              <p className="text-zinc-400 text-lg mt-2">
                {project?.description || "Real-time API monitoring and analytics"}
              </p>
            </div>
            <Button 
              onClick={() => {fetchProject(); fetchLogs();}} 
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-medium"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-600 transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Total Requests</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.totalRequests || 0}</p>
                </div>
                <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-600 transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{stats?.successRate || 0}%</p>
                </div>
                <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-600 transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Failed Requests</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{stats?.errorCount || 0}</p>
                </div>
                <div className="h-12 w-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-600 transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Avg Response</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">{stats?.avgResponseTime || 0}ms</p>
                </div>
                <div className="h-12 w-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Logs Table - Moved to top */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Recent API Logs</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Latest {Math.min(tasks.length, 50)} API requests with real-time monitoring
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableHead className="text-zinc-300 font-medium">Operation</TableHead>
                      <TableHead className="text-zinc-300 font-medium">Table</TableHead>
                      <TableHead className="text-zinc-300 font-medium">Status</TableHead>
                      <TableHead className="text-zinc-300 font-medium text-right">Response Time</TableHead>
                      <TableHead className="text-zinc-300 font-medium">Timestamp</TableHead>
                      <TableHead className="text-zinc-300 font-medium">IP Address</TableHead>
                      <TableHead className="text-zinc-300 font-medium">Error Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.slice(0, 50).map((log, index) => (
                      <TableRow 
                        key={`${log.timestamp}-${index}`} 
                        className="border-zinc-800 hover:bg-zinc-800/30 transition-colors duration-150"
                      >
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              log.operation === 'create' ? 'bg-green-400' :
                              log.operation === 'read' ? 'bg-blue-400' :
                              log.operation === 'update' ? 'bg-yellow-400' :
                              log.operation === 'delete' ? 'bg-red-400' : 'bg-gray-400'
                            }`}></span>
                            <span className="uppercase text-sm">{log.operation || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300">{log.tableName || '-'}</TableCell>
                        <TableCell>
                          {log.statusCode?.startsWith?.("2") ? (
                            <Badge className="bg-green-900 text-green-300 border-green-700 hover:bg-green-900">
                              {log.statusCode}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-900 text-red-300 border-red-700 hover:bg-red-900">
                              {log.statusCode || 'Error'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-zinc-300 font-mono">
                          {log.responseTime ? `${log.responseTime}ms` : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-zinc-400 font-mono">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-zinc-400">
                          {log.ipAddress || '-'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-zinc-400">
                          {log.errorMessage || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Database className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                <p className="text-lg">No tasks available for this project</p>
                <p className="text-sm text-zinc-600 mt-1">API calls will appear here in real-time</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Response Time Area Chart */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Response Time Trend</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Performance monitoring over last 50 requests
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {logChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={logChartData}>
                    <defs>
                      <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="index" 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#eab308" 
                      strokeWidth={2}
                      fill="url(#responseTimeGradient)"
                      dot={{ fill: '#eab308', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: '#eab308', strokeWidth: 2, fill: '#000' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-zinc-500">
                  <Activity className="h-12 w-12 mb-4" />
                  <div className="text-center">
                    <p className="text-lg">No performance data available</p>
                    <p className="text-sm text-zinc-600">Charts will update as requests come in</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Operations Distribution */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Operations Breakdown</CardTitle>
                  <CardDescription className="text-zinc-400">
                    CRUD operations distribution across all requests
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {operationChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={operationChartData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="operation" 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#e5e7eb'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[4, 4, 0, 0]}
                      stroke="#eab308"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-zinc-500">
                  <Database className="h-12 w-12 mb-4" />
                  <div className="text-center">
                    <p className="text-lg">No operations data available</p>
                    <p className="text-sm text-zinc-600">Operation breakdown will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Project;