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
  Zap,
} from "lucide-react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  // Navigation handler
  const handleNavigation = (route) => {
    navigate(route);
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

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
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

  // DB badge colors
  const getDbTypeColor = (dbType) => {
    const colors = {
      postgresql: "bg-blue-900/50 text-blue-300 border border-blue-800",
      mysql: "bg-orange-900/50 text-orange-300 border border-orange-800",
      mongodb: "bg-green-900/50 text-green-300 border border-green-800",
      sqlite: "bg-purple-900/50 text-purple-300 border border-purple-800",
    };
    return colors[dbType] || "bg-gray-800 text-gray-300 border-gray-700";
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
    <div className="min-h-screen bg-[#0d1117] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Projects</h1>
                <p className="text-xs text-gray-400 -mt-0.5">
                  Manage your development projects
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700"
            >
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </Badge>
          </div>

          {/* Create Project Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="shadow-sm flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-gray-900 border border-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-xl text-white">
                  Create New Project
                </DialogTitle>
              </DialogHeader>
              <form className="space-y-5 pt-2" onSubmit={createProject}>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Project Name
                  </label>
                  <Input
                    placeholder="Enter project name"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Description
                  </label>
                  <Input
                    placeholder="Brief description of your project"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Database URL
                  </label>
                  <Input
                    placeholder="postgresql://username:password@localhost:5432/dbname"
                    value={formData.dbUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, dbUrl: e.target.value })
                    }
                    required
                    className="font-mono text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Database Type
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100"
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
                <div className="flex justify-end space-x-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                  >
                    Create Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search + view controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
            <Input
              placeholder="Search projects..."
              className="pl-9 bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`${
                viewMode === "grid"
                  ? "bg-gray-800 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={`${
                viewMode === "list"
                  ? "bg-gray-800 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {loading ? (
          <p className="text-center text-gray-400">Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Database className="h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white">
              No projects found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Create a new project to get started.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Project
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
                className="bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle
                      className="text-lg font-semibold text-white cursor-pointer hover:underline"
                      onClick={() => handleNavigation(`/projects/${project.id}`)}
                    >
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-2">
                      {project.description || "No description"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-gray-900 border border-gray-800"
                    >
                      <DropdownMenuItem
                        className="text-gray-200 hover:bg-gray-800 cursor-pointer"
                        onClick={() =>
                          handleNavigation(`/projects/${project.id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-200 hover:bg-gray-800 cursor-pointer"
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
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem
                        className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getDbTypeColor(project.dbType)}>
                      {project.dbType}
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-300 border border-gray-700">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(project.createdAt)}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => handleNavigation(`/projects/${project.id}`)}
                  >
                    Open Project
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
          <DialogContent className="sm:max-w-[480px] bg-gray-900 border border-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                Edit Project
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-5 pt-2" onSubmit={updateProject}>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Project Name
                </label>
                <Input
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
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
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Database URL
                </label>
                <Input
                  value={editFormData.dbUrl}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dbUrl: e.target.value })
                  }
                  required
                  className="font-mono text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Database Type
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100"
                  value={editFormData.dbType}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dbType: e.target.value })
                  }
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="sqlite">SQLite</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProject(null)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectsDashboard;
