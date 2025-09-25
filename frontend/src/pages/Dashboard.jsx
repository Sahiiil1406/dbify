import React, { useState, useEffect } from 'react';
import { Plus, Search, Grid, List, MoreVertical, Calendar, Database, Globe, Trash2, Edit3, Eye, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Create project modal
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', dbUrl: '', dbType: 'postgresql' });

  // Edit project modal
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', dbUrl: '', dbType: 'postgresql' });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/projects`, { withCredentials: true });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create project
  const createProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/projects`, formData, { withCredentials: true });
      setProjects(prev => [response.data, ...prev]);
      setShowCreateDialog(false);
      setFormData({ title: '', description: '', dbUrl: '', dbType: 'postgresql' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  // Update project
  const updateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_URL}/api/projects/${editingProject.id}`, editFormData, { withCredentials: true });
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...editFormData } : p));
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/projects/${id}`, { withCredentials: true });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtered projects
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // DB badge colors
  const getDbTypeColor = (dbType) => {
    const colors = {
      postgresql: 'bg-blue-100 text-blue-800 border-blue-200',
      mysql: 'bg-orange-100 text-orange-800 border-orange-200',
      mongodb: 'bg-green-100 text-green-800 border-green-200',
      sqlite: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[dbType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center shadow-sm">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
                <p className="text-xs text-gray-500 -mt-0.5">Manage your development projects</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </Badge>
          </div>

          {/* Create Project Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="shadow-sm flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Project</DialogTitle>
              </DialogHeader>
              <form className="space-y-5 pt-2" onSubmit={createProject}>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Project Name</label>
                  <Input
                    placeholder="Enter project name"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Description</label>
                  <Input
                    placeholder="Brief description of your project"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Database URL</label>
                  <Input
                    placeholder="postgresql://username:password@localhost:5432/dbname"
                    value={formData.dbUrl}
                    onChange={(e) => setFormData({...formData, dbUrl: e.target.value})}
                    required
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Database Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={formData.dbType}
                    onChange={(e) => setFormData({...formData, dbType: e.target.value})}
                  >
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="sqlite">SQLite</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-6">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button type="submit" className="px-6">Create Project</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search & View Mode */}
      <div className="container mx-auto px-6 py-6 flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-1 bg-white rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-3"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects List/Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-32 w-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <Database className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search terms or create a new project.' : 'Get started by creating your first project and begin building amazing things.'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateDialog(true)} size="lg" className="px-8 flex items-center justify-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group transition-all duration-300 border-0 shadow-sm hover:shadow-2xl hover:-translate-y-1 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1.5 line-clamp-2">
                      {project.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => alert(JSON.stringify(project, null, 2))}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingProject(project);
                          setEditFormData({
                            title: project.title,
                            description: project.description || '',
                            dbUrl: project.dbUrl,
                            dbType: project.dbType
                          });
                        }}
                      >
                        <Edit3 className="h-4 w-4 mr-2" /> Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      <Badge variant="outline" className={`text-xs font-medium ${getDbTypeColor(project.dbType)}`}>
                        {project.dbType?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1.5 text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">API Key</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="font-mono text-sm bg-white px-3 py-2 rounded border text-gray-800 select-all">
                      {project.apiKey}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" className="text-xs h-8 px-3">
                      <Eye className="h-3 w-3 mr-1.5" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit3 className="h-3 w-3 mr-1.5" /> Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Project</DialogTitle>
          </DialogHeader>
          <form className="space-y-5 pt-2" onSubmit={updateProject}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Project Name</label>
              <Input
                value={editFormData.title}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Description</label>
              <Input
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Database URL</label>
              <Input
                value={editFormData.dbUrl}
                onChange={(e) => setEditFormData({...editFormData, dbUrl: e.target.value})}
                required
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Database Type</label>
              <select
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={editFormData.dbType}
                onChange={(e) => setEditFormData({...editFormData, dbType: e.target.value})}
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
              <Button type="submit" className="px-6">Update Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsDashboard;
