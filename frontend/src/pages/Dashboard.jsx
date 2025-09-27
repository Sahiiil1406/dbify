import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Grid,
  List,
  MoreVertical,
  Calendar,
  Database,
  Globe,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Zap,
  BarChart3,
  FileText,
  Key,
  Copy,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [visibleApiKeys, setVisibleApiKeys] = useState({});
  const [copiedItems, setCopiedItems] = useState({});
  const navigate = useNavigate();

  // Navigation handler
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    navigate(route); // Use when router is available
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = (projectId) => {
    setVisibleApiKeys(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text, type, projectId) => {
    try {
      await navigator.clipboard.writeText(text);
      const key = `${projectId}-${type}`;
      setCopiedItems(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Truncate long URLs
  const truncateUrl = (url, maxLength = 35) => {
    if (!url || url.length <= maxLength) return url;
    const start = url.substring(0, 15);
    const end = url.substring(url.length - 15);
    return `${start}...${end}`;
  };

  // Mask API key
  const maskApiKey = (apiKey, isVisible) => {
    if (!apiKey) return 'No API key';
    if (isVisible) return apiKey;
    return '••••••••••••••••••';
  };

  // Create project modal
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dbUrl: "",
    dbType: "postgresql",
  });

  // Edit project modal
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    dbUrl: "",
    dbType: "postgresql",
  });

  // Fetch projects (using mock data for demo)
  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      // const mockProjects = [
      //   {
      //     id: 1,
      //     title: 'test1',
      //     description: 'desc1',
      //     dbUrl: 'postgresql://username:password@very-long-hostname.example.com:5432/database_name',
      //     dbType: 'postgresql',
      //     apiKey: '696082b431df5581c2',
      //     userId: 2,
      //     createdAt: '2025-08-26T19:24:21.859Z',
      //     updatedAt: '2025-08-26T19:24:21.859Z'
      //   },
      //   {
      //     id: 2,
      //     title: 'E-commerce Analytics',
      //     description: 'Real-time analytics dashboard for e-commerce platform',
      //     dbUrl: 'mongodb://admin:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority',
      //     dbType: 'mongodb',
      //     apiKey: 'abc123def456ghi789',
      //     userId: 2,
      //     createdAt: '2025-08-25T14:30:15.123Z',
      //     updatedAt: '2025-08-25T14:30:15.123Z'
      //   }
      // ];
      // setProjects(mockProjects);
      // console.log(mockProjects);
      
      // Uncomment for actual API call:
      const response = await axios.get(`${BACKEND_URL}/api/projects`, {
        withCredentials: true,
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create project
  const createProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/projects`,
        formData,
        { withCredentials: true }
      );
      setProjects((prev) => [response.data, ...prev]);
      setShowCreateDialog(false);
      setFormData({
        title: "",
        description: "",
        dbUrl: "",
        dbType: "postgresql",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  // Update project
  const updateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BACKEND_URL}/api/projects/${editingProject.id}`,
        editFormData,
        { withCredentials: true }
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id ? { ...p, ...editFormData } : p
        )
      );
      setEditingProject(null);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/projects/${id}`, {
        withCredentials: true,
      });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtered projects
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // DB badge colors with yellow accent theme
  const getDbTypeColor = (dbType) => {
    const colors = {
      postgresql: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      mysql: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      mongodb: "bg-green-500/20 text-green-400 border border-green-500/30",
      sqlite: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    };
    return colors[dbType] || "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Zap className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
                <p className="text-sm text-gray-400 -mt-1">
                  Manage your development projects
                </p>
              </div>
            </div>
            <Badge className="text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </Badge>
          </div>

          {/* Create Project Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-yellow-500/20 flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl px-6 py-2.5">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gray-900/95 border border-gray-800/50 text-white backdrop-blur-xl rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  Create New Project
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200">
                    Project Name
                  </label>
                  <Input
                    placeholder="Enter project name"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="bg-black/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200">
                    Description
                  </label>
                  <Input
                    placeholder="Brief description of your project"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-black/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200">
                    Database URL
                  </label>
                  <Input
                    placeholder="postgresql://username:password@localhost:5432/dbname"
                    value={formData.dbUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, dbUrl: e.target.value })
                    }
                    required
                    className="font-mono text-sm bg-black/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200">
                    Database Type
                  </label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-gray-700/50 bg-black/50 px-3 py-2 text-sm text-white"
                    value={formData.dbType}
                    onChange={(e) =>
                      setFormData({ ...formData, dbType: e.target.value })
                    }
                  >
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="sqlite">SQLite</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="border-gray-700/50 text-gray-300 bg-gray-800/50 rounded-xl px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={createProject}
                    className="px-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl shadow-lg shadow-yellow-500/20"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-10">
        {/* Search + view controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="h-5 w-5 absolute left-4 top-3.5 text-gray-500" />
            <Input
              placeholder="Search projects..."
              className="pl-12 h-12 bg-gray-900/50 border border-gray-800/50 text-white placeholder-gray-500 rounded-xl backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 bg-gray-900/30 rounded-xl p-2 backdrop-blur-sm">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`h-10 w-10 rounded-lg ${
                viewMode === "grid"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "text-gray-400 bg-gray-800/50"
              }`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={`h-10 w-10 rounded-lg ${
                viewMode === "list"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "text-gray-400 bg-gray-800/50"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              <p className="text-gray-400">Loading projects...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center mb-6 border border-yellow-500/20">
              <Database className="h-12 w-12 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
              {searchQuery ? "Try adjusting your search terms." : "Create a new project to get started with your development workflow."}
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl px-8 py-3 shadow-lg shadow-yellow-500/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-2xl backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="flex-1">
                    <CardTitle
                      className="text-xl font-bold text-white cursor-pointer line-clamp-1 hover:text-yellow-400 transition-colors"
                      onClick={() => handleNavigation(`/projects/${project.id}`)}
                    >
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {project.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-xl h-9 w-9 transition-all"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 bg-gray-900/95 border border-gray-800/50 rounded-xl backdrop-blur-xl"
                    >
                      <DropdownMenuItem
                        className="text-gray-200 hover:bg-gray-800/50 cursor-pointer rounded-lg mx-1 my-1 transition-colors"
                        onClick={() =>
                          handleNavigation(`/projects/${project.id}`)
                        }
                      >
                        <Eye className="mr-3 h-4 w-4" /> View Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-200 hover:bg-gray-800/50 cursor-pointer rounded-lg mx-1 my-1 transition-colors"
                        onClick={() => {
                          setEditingProject(project);
                          setEditFormData({
                            title: project.title,
                            description: project.description,
                            dbUrl: project.dbUrl,
                            dbType: project.dbType,
                          });
                        }}
                      >
                        <Edit3 className="mr-3 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800/50 mx-1" />
                      <DropdownMenuItem
                        className="text-red-400 hover:bg-red-500/10 cursor-pointer rounded-lg mx-1 my-1 transition-colors"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="mr-3 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Project Details Section */}
                  <div className="space-y-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    {/* API Key Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-300">API Key</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono bg-gray-900/50 px-2 py-1 rounded-lg text-gray-300 border border-gray-700/50">
                          {maskApiKey(project.apiKey, visibleApiKeys[project.id])}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-white"
                          onClick={() => toggleApiKeyVisibility(project.id)}
                        >
                          {visibleApiKeys[project.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard(project.apiKey, 'api', project.id)}
                        >
                          {copiedItems[`${project.id}-api`] ? (
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Database URL Row */}
                    {project.dbUrl && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">Database</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code 
                            className="text-xs font-mono bg-gray-900/50 px-2 py-1 rounded-lg text-gray-300 border border-gray-700/50 max-w-40 truncate"
                            title={project.dbUrl}
                          >
                            {truncateUrl(project.dbUrl)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-white"
                            onClick={() => copyToClipboard(project.dbUrl, 'db', project.id)}
                          >
                            {copiedItems[`${project.id}-db`] ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDbTypeColor(project.dbType)}>
                      <Database className="h-3 w-3 mr-1" />
                      {project.dbType}
                    </Badge>
                    <Badge className="bg-gray-500/20 text-gray-300 border border-gray-500/30">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(project.createdAt)}
                    </Badge>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-800/50 hover:bg-gray-700/50 text-white hover:text-yellow-400 border-gray-700/50 hover:border-yellow-500/30 rounded-xl font-medium transition-all"
                      onClick={() => handleNavigation(`/projects/${project.id}`)}
                    >
                      <Eye className="h-3 w-3 mr-2" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 hover:text-yellow-200 border-yellow-500/30 hover:border-yellow-400/50 rounded-xl font-medium transition-all"
                      onClick={() => handleNavigation(`/visualize/${project.id}`)}
                    >
                      <BarChart3 className="h-3 w-3 mr-2" />
                      Visualize
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 border-blue-500/30 hover:border-blue-400/50 rounded-xl font-medium transition-all"
                    onClick={() => handleNavigation(`/docs/${project.id}`)}
                  >
                    <FileText className="h-3 w-3 mr-2" />
                    View Docs
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={true} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="sm:max-w-[500px] bg-gray-900/95 border border-gray-800/50 text-white backdrop-blur-xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                Edit Project
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200">
                  Project Name
                </label>
                <Input
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  className="bg-black/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200">
                  Description
                </label>
                <Input
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className="bg-black/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200">
                  Database URL
                </label>
                <Input
                  value={editFormData.dbUrl}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dbUrl: e.target.value })
                  }
                  required
                  className="font-mono text-sm bg-black/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200">
                  Database Type
                </label>
                <select
                  className="flex h-11 w-full rounded-xl border border-gray-700/50 bg-black/50 px-3 py-2 text-sm text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  value={editFormData.dbType}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dbType: e.target.value })
                  }
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="sqlite">SQLite</option>
                  <option value="sqlite">SQLite</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProject(null)}
                  className="border-gray-700/50 text-gray-300 hover:bg-gray-800/50 rounded-xl px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={updateProject}
                  className="px-8 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold rounded-xl shadow-lg shadow-yellow-500/20 transition-all duration-200 transform hover:scale-105"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectsDashboard;