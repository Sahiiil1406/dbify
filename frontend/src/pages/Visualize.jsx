import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Database, Key, Link } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// UML-Style Table Node Component
const UMLTableNode = ({ data, selected }) => {
  // Parse columns from label (format: "TableName\ncolumn1, column2, ...")
  const parseColumns = (label) => {
    const lines = label.split('\n');
    const tableName = lines[0];
    const columnsText = lines[1] || '';
    const columns = columnsText.split(', ').map(col => col.trim()).filter(col => col);
    
    return { tableName, columns };
  };

  const { tableName, columns } = parseColumns(data.label);

  // Identify key types based on common naming patterns
  const getColumnType = (columnName) => {
    if (columnName === 'id' || (columnName.endsWith('_id') && !columnName.includes('user'))) {
      return 'PRIMARY';
    }
    if (columnName.endsWith('Id') || columnName.endsWith('_id')) {
      return 'FOREIGN';
    }
    if (columnName.includes('email') || columnName.includes('password')) {
      return 'UNIQUE';
    }
    return 'NORMAL';
  };

  return (
    <div 
      className={`bg-gray-800 border-2 rounded-lg shadow-xl transition-all min-w-64 relative ${
        selected ? 'border-yellow-400 shadow-yellow-400/30' : 'border-gray-600 hover:border-gray-500'
      }`}
    >
      {/* Table Header */}
      <div className="bg-gray-700 px-4 py-3 rounded-t-lg border-b border-gray-600">
        <div className="flex items-center">
          <Database className="h-4 w-4 text-blue-400 mr-2" />
          <h3 className="text-white font-bold text-lg">{tableName}</h3>
        </div>
      </div>
      
      {/* Columns with React Flow Handles */}
      <div className="p-0 relative">
        {columns.map((column, idx) => {
          const columnType = getColumnType(column);
          const handleId = `${tableName}-${column}`;
          
          return (
            <div 
              key={idx} 
              className={`relative flex items-center px-4 py-2 border-b border-gray-700 last:border-b-0 ${
                columnType === 'PRIMARY' ? 'bg-yellow-900/20' : 
                columnType === 'FOREIGN' ? 'bg-green-900/20' : 
                'hover:bg-gray-700/30'
              }`}
            >
              {/* React Flow Handles for connections */}
              {columnType === 'PRIMARY' && (
                <>
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`${handleId}-target`}
                    className="w-3 h-3 bg-yellow-400 border-2 border-yellow-600"
                    style={{ left: '-6px' }}
                  />
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`${handleId}-source`}
                    className="w-3 h-3 bg-yellow-400 border-2 border-yellow-600"
                    style={{ right: '-6px' }}
                  />
                </>
              )}
              
              {columnType === 'FOREIGN' && (
                <>
                  <Handle
                    type="source"
                    position={Position.Left}
                    id={`${handleId}-source`}
                    className="w-3 h-3 bg-green-400 border-2 border-green-600"
                    style={{ left: '-6px' }}
                  />
                  <Handle
                    type="target"
                    position={Position.Right}
                    id={`${handleId}-target`}
                    className="w-3 h-3 bg-green-400 border-2 border-green-600"
                    style={{ right: '-6px' }}
                  />
                </>
              )}

              <div className="flex items-center min-w-0 flex-1">
                {/* Key Icon */}
                {columnType === 'PRIMARY' && (
                  <Key className="h-3 w-3 text-yellow-400 mr-2 flex-shrink-0" />
                )}
                {columnType === 'FOREIGN' && (
                  <Link className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                )}
                {columnType === 'UNIQUE' && (
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2 flex-shrink-0"></div>
                )}
                {columnType === 'NORMAL' && (
                  <div className="w-3 h-3 mr-2 flex-shrink-0"></div>
                )}
                
                {/* Column Name */}
                <span className={`text-sm font-medium truncate ${
                  columnType === 'PRIMARY' ? 'text-yellow-300' :
                  columnType === 'FOREIGN' ? 'text-green-300' :
                  columnType === 'UNIQUE' ? 'text-blue-300' :
                  'text-gray-300'
                }`}>
                  {column}
                </span>
              </div>
              
              {/* Type Badge */}
              {columnType !== 'NORMAL' && (
                <span className={`px-2 py-0.5 text-xs rounded font-medium ml-2 ${
                  columnType === 'PRIMARY' ? 'bg-yellow-600 text-black' :
                  columnType === 'FOREIGN' ? 'bg-green-600 text-white' :
                  columnType === 'UNIQUE' ? 'bg-blue-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {columnType === 'PRIMARY' ? 'PK' : columnType === 'FOREIGN' ? 'FK' : 'UQ'}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer with record count */}
      <div className="bg-gray-700 px-4 py-2 rounded-b-lg border-t border-gray-600">
        <div className="text-xs text-gray-400">
          {columns.length} columns
        </div>
      </div>
    </div>
  );
};

// Node types for React Flow
const nodeTypes = {
  umlTable: UMLTableNode,
};

// Transform API data to React Flow format
const transformApiData = (apiData) => {
  const nodes = apiData.nodes.map((node, index) => ({
    id: node.data.id,
    type: 'umlTable',
    position: { 
      x: 100 + (index % 3) * 400, 
      y: 100 + Math.floor(index / 3) * 300 
    },
    data: {
      ...node.data,
      tableName: node.data.id
    }
  }));

  const edges = apiData.edges.map((edge) => {
    // Extract source and target column info from label
    const labelParts = edge.data.label.split(' → ');
    const sourceColumn = labelParts[0];
    const targetColumn = labelParts[1];

    // Generate proper handle IDs
    const sourceHandleId = `${edge.data.source}-${sourceColumn}-source`;
    const targetHandleId = `${edge.data.target}-${targetColumn}-target`;

    return {
      id: edge.data.id,
      source: edge.data.source,
      target: edge.data.target,
      sourceHandle: sourceHandleId,
      targetHandle: targetHandleId,
      type: 'smoothstep',
      label: edge.data.label,
      labelStyle: { 
        fill: '#F59E0B', 
        fontSize: 12, 
        fontWeight: 600,
        background: '#1F2937',
        padding: '4px 8px',
        borderRadius: '4px'
      },
      labelBgStyle: { 
        fill: '#1F2937', 
        fillOpacity: 0.9,
        rx: 4,
        ry: 4
      },
      style: {
        stroke: '#10B981',
        strokeWidth: 3,
        strokeDasharray: '0',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#10B981',
        width: 20,
        height: 20,
      },
      animated: true,
    };
  });

  return { nodes, edges };
};

const Visualize = () => {
  const { projectId } = useParams();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [projectInfo, setProjectInfo] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Fetch visualization data
  useEffect(() => {
    const fetchVisualizationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(`${BACKEND_URL}/api/docs/visualize/${projectId}`, {
          withCredentials: true
        });
        
        const apiData = res.data;
        console.log('API Response:', apiData);
        
        if (!apiData.nodes || !apiData.edges) {
          throw new Error('Invalid API response format');
        }

        const { nodes: transformedNodes, edges: transformedEdges } = transformApiData(apiData);
        
        setNodes(transformedNodes);
        setEdges(transformedEdges);
        
        // Extract project info if available
        setProjectInfo({
          totalTables: apiData.nodes.length,
          totalRelations: apiData.edges.length,
          tables: apiData.nodes.map(n => n.data.id)
        });
        
      } catch (err) {
        console.error('Error fetching visualization data:', err);
        setError(err.response?.data?.message || 'Failed to load visualization data');
        
        // Mock data for demo
        const mockApiData = {
          "nodes": [
            {
              "data": {
                "id": "Project",
                "label": "Project\nid, title, description, apiKey, userId, createdAt, updatedAt, dbType, dbUrl"
              }
            },
            {
              "data": {
                "id": "User", 
                "label": "User\nid, email, name, password"
              }
            },
            {
              "data": {
                "id": "_prisma_migrations",
                "label": "_prisma_migrations\nid, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count"
              }
            }
          ],
          "edges": [
            {
              "data": {
                "id": "Project_userId_to_User",
                "source": "Project",
                "target": "User", 
                "label": "userId → id"
              }
            }
          ]
        };
        
        const { nodes: mockNodes, edges: mockEdges } = transformApiData(mockApiData);
        setNodes(mockNodes);
        setEdges(mockEdges);
        setProjectInfo({
          totalTables: mockApiData.nodes.length,
          totalRelations: mockApiData.edges.length,
          tables: mockApiData.nodes.map(n => n.data.id)
        });
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchVisualizationData();
    }
  }, [projectId, setNodes, setEdges]);

  const refresh = useCallback(() => {
    if (projectId) {
      setLoading(true);
      setError(null);
      // Re-trigger the effect
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Database Schema Visualization</h1>
            <p className="text-gray-400">Project ID: {projectId}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-yellow-400 animate-spin" />
            <span className="text-gray-300">Loading schema...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Database Schema Visualization</h1>
            <div className="flex items-center space-x-4 text-gray-400 mt-1">
              <span>Project ID: {projectId}</span>
              {projectInfo && (
                <>
                  <span>•</span>
                  <span>{projectInfo.totalTables} tables</span>
                  <span>•</span>
                  <span>{projectInfo.totalRelations} relations</span>
                </>
              )}
              {error && (
                <>
                  <span>•</span>
                  <span className="text-yellow-400">Demo Mode</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refresh}
              className="flex items-center px-4 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-500 transition-colors font-medium"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* React Flow Visualization */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-gray-900"
            minZoom={0.2}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          >
            <Background 
              color="#374151" 
              gap={20} 
              size={1}
              variant="dots"
            />
            <Controls 
              className="bg-gray-800 border-gray-600 shadow-lg"
              showInteractive={false}
            />
            <MiniMap 
              nodeColor="#4B5563"
              maskColor="rgba(0, 0, 0, 0.8)"
              className="bg-gray-800 border border-gray-600"
              zoomable
              pannable
            />
            
            {/* Legend Panel */}
            <Panel position="top-right" className="text-gray-300 text-sm">
              <div className="bg-gray-800 p-4 rounded border border-gray-600 shadow-lg">
                <h4 className="font-semibold mb-3 text-white">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Key className="h-3 w-3 text-yellow-400 mr-2" />
                    <span>Primary Key</span>
                  </div>
                  <div className="flex items-center">
                    <Link className="h-3 w-3 text-green-400 mr-2" />
                    <span>Foreign Key</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <span>Unique Field</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-green-400 mr-2"></div>
                    <span>Relationship</span>
                  </div>
                </div>
              </div>
            </Panel>

            {/* Stats Panel */}
            <Panel position="top-left" className="text-gray-300 text-sm">
              <div className="bg-gray-800 p-4 rounded border border-gray-600 shadow-lg">
                <h4 className="font-semibold mb-2 text-white">Schema Stats</h4>
                <div className="space-y-1">
                  <div>Tables: <span className="text-yellow-400">{nodes.length}</span></div>
                  <div>Relations: <span className="text-green-400">{edges.length}</span></div>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Side Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-gray-800 bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Database className="h-5 w-5 text-blue-400 mr-2" />
                Table Details
              </h3>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Table Name</label>
                <p className="text-white font-medium text-lg">{selectedNode.data.tableName}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Columns</label>
                <div className="mt-2 space-y-1 max-h-96 overflow-y-auto">
                  {selectedNode.data.label.split('\n')[1]?.split(', ').map((column, idx) => {
                    const columnType = column === 'id' || column.endsWith('_id') && !column.includes('user') ? 'PRIMARY' :
                                     column.endsWith('Id') || column.endsWith('_id') ? 'FOREIGN' :
                                     column.includes('email') || column.includes('password') ? 'UNIQUE' : 'NORMAL';
                    
                    return (
                      <div key={idx} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <div className="flex items-center">
                          {columnType === 'PRIMARY' && <Key className="h-3 w-3 text-yellow-400 mr-2" />}
                          {columnType === 'FOREIGN' && <Link className="h-3 w-3 text-green-400 mr-2" />}
                          {columnType === 'UNIQUE' && <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>}
                          {columnType === 'NORMAL' && <div className="w-3 h-3 mr-2"></div>}
                          <span className="text-white text-sm">{column.trim()}</span>
                        </div>
                        {columnType !== 'NORMAL' && (
                          <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                            columnType === 'PRIMARY' ? 'bg-yellow-600 text-black' :
                            columnType === 'FOREIGN' ? 'bg-green-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {columnType === 'PRIMARY' ? 'PK' : columnType === 'FOREIGN' ? 'FK' : 'UQ'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Position</label>
                <p className="text-gray-300 text-sm">
                  X: {Math.round(selectedNode.position.x)}, Y: {Math.round(selectedNode.position.y)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualize;