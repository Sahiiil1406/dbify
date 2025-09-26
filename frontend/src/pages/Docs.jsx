import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL=import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const Docs = () => {
  const { projectId } = useParams();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocumentation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BACKEND_URL}/api/docs/${projectId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setApiData(data);
    } catch (err) {
      console.error("Error loading documentation:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentation();
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  };

  const CopyButton = ({ text, children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <button
        className={`copy-btn ${copied ? "copied" : ""}`}
        onClick={handleCopy}
        style={{
          background: copied ? "var(--success)" : "var(--bg-card)",
          color: copied ? "white" : "var(--text-secondary)",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    );
  };

  const EndpointCard = ({ table, operation }) => {
    const endpoint = table.endpoints[operation];
    if (!endpoint) return null;

    const methodClass = `method-${operation}`;
    const operationTitle =
      operation.charAt(0).toUpperCase() + operation.slice(1);
    const codeText = JSON.stringify(endpoint.payload, null, 2);

    return (
      <div className="endpoint-card">
        <div className="endpoint-header">
          <div className={`method-badge ${methodClass}`}>
            {operation.toUpperCase()}
          </div>
          <div className="endpoint-title">
            {operationTitle} {table.table}
          </div>
        </div>
        <div className="code-block">
          <CopyButton text={codeText} />
          <pre>{codeText}</pre>
        </div>
      </div>
    );
  };

  const TableSection = ({ table }) => {
    const primaryKeys = table.primaryKeys ? table.primaryKeys.join(", ") : "id";
    const foreignKeys = table.columns.filter((col) => col.isForeignKey);
    const foreignKeyText =
      foreignKeys.length > 0
        ? ` • Foreign Keys: ${foreignKeys.map((fk) => `${fk.name} → ${fk.foreignTable}.${fk.foreignColumn}`).join(", ")}`
        : "";

    return (
      <div className="section fade-in">
        <h2 className="section-title">{table.table}</h2>
        <p className="section-subtitle">
          Database table with {table.columns.length} columns and full CRUD
          operations.
        </p>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Schema</div>
            <div className="card-subtitle">
              {table.columns.length} columns • Primary Key: {primaryKeys}
              {foreignKeyText}
            </div>
          </div>
          <div className="card-content">
            <table className="table-schema">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Type</th>
                  <th>Nullable</th>
                  <th>Key</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col, index) => (
                  <tr key={index}>
                    <td className="column-name">{col.name}</td>
                    <td>
                      <span className="column-type">{col.dataType}</span>
                    </td>
                    <td
                      className={
                        col.isNullable ? "nullable-yes" : "nullable-no"
                      }
                    >
                      {col.isNullable ? "Yes" : "No"}
                    </td>
                    <td>
                      {col.isPrimaryKey && (
                        <span className="badge badge-primary">PRIMARY</span>
                      )}
                      {col.isForeignKey && (
                        <span className="badge badge-success">FOREIGN</span>
                      )}
                      {!col.isPrimaryKey && !col.isForeignKey && (
                        <span className="badge badge-secondary">—</span>
                      )}
                    </td>
                    <td>{col.defaultValue || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoints-grid">
          {["create", "read", "update", "delete"].map((operation) => (
            <EndpointCard key={operation} table={table} operation={operation} />
          ))}
        </div>
      </div>
    );
  };

  const CurlExamples = () => {
    if (!apiData || !apiData.tables || apiData.tables.length === 0) return null;

    const firstTable = apiData.tables.find(
      (table) => table.table !== "_prisma_migrations"
    );
    if (!firstTable) return null;

    const examples = [
      {
        title: `Create ${firstTable.table}`,
        operation: "create",
        payload: firstTable.endpoints.create.payload,
      },
      {
        title: `Read ${firstTable.table}`,
        operation: "read",
        payload: firstTable.endpoints.read.payload,
      },
      {
        title: `Update ${firstTable.table}`,
        operation: "update",
        payload: firstTable.endpoints.update.payload,
      },
      {
        title: `Delete ${firstTable.table}`,
        operation: "delete",
        payload: firstTable.endpoints.delete.payload,
      },
    ];

    return (
      <div className="curl-examples">
        {examples.map((example, index) => {
          const curlCommand = `curl -X POST http://localhost:5000/api/query \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(example.payload).replace(/'/g, "\\'")}'`;

          return (
            <div key={index} className="curl-example">
              <h4>{example.title}</h4>
              <div className="code-block">
                <CopyButton text={curlCommand} />
                <pre>{curlCommand}</pre>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ color: "var(--text-secondary)" }}>
            Loading API documentation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Failed to Load Documentation</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadDocumentation}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tableCount = apiData?.tableCount || apiData?.tables?.length || 0;
  const endpointCount = tableCount * 4;
  const tables =
    apiData?.tables?.filter((table) => table.table !== "_prisma_migrations") ||
    [];

  return (
    <div className="docs-container">
      <style jsx>{`
        .docs-container {
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #0a0a0a;
          color: #ffffff;
          line-height: 1.6;
          min-height: 100vh;
          --bg-primary: #0a0a0a;
          --bg-secondary: #111111;
          --bg-card: #1a1a1a;
          --text-primary: #ffffff;
          --text-secondary: #a3a3a3;
          --text-muted: #737373;
          --border: #262626;
          --border-light: #1f1f1f;
          --accent: #fbbf24;
          --accent-light: #fef3c7;
          --accent-dark: #f59e0b;
          --success: #22c55e;
          --warning: #f97316;
          --error: #ef4444;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          flex-direction: column;
          gap: 1rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid var(--border);
          border-top: 2px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error {
          background: rgba(15, 15, 15, 0.8);
          border: 1px solid #404040;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          color: var(--error);
          margin: 2rem 0;
        }

        .error h3 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .retry-btn {
          background: var(--error);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          margin-top: 1rem;
          transition: opacity 0.2s;
        }

        .retry-btn:hover {
          opacity: 0.9;
        }

        .header {
          text-align: center;
          margin-bottom: 4rem;
          padding: 3rem 0;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .header p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .endpoint-badge {
          display: inline-block;
          background: var(--bg-card);
          color: var(--accent);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: "SF Mono", "Monaco", "Cascadia Code", monospace;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid var(--border);
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 1.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          letter-spacing: -0.025em;
        }

        .section-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .card {
          background: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border);
          margin-bottom: 2rem;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-light);
          background: var(--bg-secondary);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .card-content {
          padding: 0;
        }

        .table-schema {
          width: 100%;
          border-collapse: collapse;
        }

        .table-schema th,
        .table-schema td {
          padding: 0.75rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--border-light);
        }

        .table-schema th {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.875rem;
        }

        .table-schema td {
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .table-schema tr:last-child td {
          border-bottom: none;
        }

        .column-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .column-type {
          font-family: "SF Mono", "Monaco", "Cascadia Code", monospace;
          font-size: 0.8125rem;
          color: var(--accent);
          background: rgba(251, 191, 36, 0.1);
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }

        .badge {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-primary {
          background: rgba(251, 191, 36, 0.2);
          color: var(--accent);
        }

        .badge-success {
          background: rgba(34, 197, 94, 0.2);
          color: var(--success);
        }

        .badge-secondary {
          background: var(--bg-secondary);
          color: var(--text-muted);
        }

        .nullable-yes {
          color: var(--error);
        }
        .nullable-no {
          color: var(--success);
        }

        .endpoints-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .endpoint-card {
          background: var(--bg-card);
          border-radius: 8px;
          border: 1px solid var(--border);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .endpoint-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--accent);
          transform: translateY(-1px);
        }

        .endpoint-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-light);
          background: var(--bg-secondary);
        }

        .method-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .method-create {
          background: rgba(34, 197, 94, 0.2);
          color: var(--success);
        }

        .method-read {
          background: rgba(251, 191, 36, 0.2);
          color: var(--accent);
        }

        .method-update {
          background: rgba(249, 115, 22, 0.2);
          color: var(--warning);
        }

        .method-delete {
          background: rgba(239, 68, 68, 0.2);
          color: var(--error);
        }

        .endpoint-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .code-block {
          background: #0f0f0f;
          padding: 1rem;
          font-family: "SF Mono", "Monaco", "Cascadia Code", monospace;
          font-size: 0.75rem;
          color: var(--text-secondary);
          overflow-x: auto;
          position: relative;
          border-top: 1px solid var(--border-light);
          border: 1px solid var(--border);
          border-radius: 0 0 8px 8px;
        }

        .code-block pre {
          margin: 0;
          white-space: pre-wrap;
        }

        .copy-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: var(--bg-card);
          color: var(--text-secondary);
          border: 1px solid var(--border);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.6875rem;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: var(--accent);
          color: var(--bg-primary);
          border-color: var(--accent);
        }

        .curl-section {
          margin-top: 3rem;
          background: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .curl-header {
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .curl-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .curl-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .curl-examples {
          padding: 1.5rem;
        }

        .curl-example {
          margin-bottom: 1.5rem;
        }

        .curl-example:last-child {
          margin-bottom: 0;
        }

        .curl-example h4 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .response-section {
          margin-top: 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .response-example {
          background: var(--bg-secondary);
          border-radius: 8px;
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .response-header {
          padding: 0.75rem 1rem;
          font-weight: 500;
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .success-header {
          background: rgba(34, 197, 94, 0.2);
          color: var(--success);
        }

        .error-header {
          background: rgba(239, 68, 68, 0.2);
          color: var(--error);
        }

        .response-body {
          padding: 1rem;
          font-family: "SF Mono", "Monaco", "Cascadia Code", monospace;
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: #0f0f0f;
          white-space: pre-wrap;
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .stats-row {
            flex-direction: column;
            gap: 1rem;
          }

          .endpoints-grid {
            grid-template-columns: 1fr;
          }

          .response-section {
            grid-template-columns: 1fr;
          }

          .table-schema th,
          .table-schema td {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="header fade-in">
          <h1>Dbify API</h1>
          <p>
            {apiData?.overview ||
              "Auto-generated CRUD APIs for your database. Each table gets comprehensive endpoints for create, read, update, and delete operations."}
          </p>
          <div className="endpoint-badge">POST https://api.dbify.com/query</div>
          <div className="stats-row">
            <div className="stat">
              <div className="stat-number">{tableCount}</div>
              <div className="stat-label">Tables</div>
            </div>
            <div className="stat">
              <div className="stat-number">{endpointCount}</div>
              <div className="stat-label">Endpoints</div>
            </div>
            <div className="stat">
              <div className="stat-number">4</div>
              <div className="stat-label">Operations</div>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="section fade-in">
          <h2 className="section-title">Authentication</h2>
          <p className="section-subtitle">
            All requests require authentication via projectId and apiKey
            parameters included in the request payload.
          </p>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Required Parameters</div>
              <div className="card-subtitle">
                Include these in every API call
              </div>
            </div>
            <div className="card-content">
              <table className="table-schema">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="column-name">projectId</td>
                    <td>
                      <span className="column-type">integer</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Yes</span>
                    </td>
                    <td>Your unique project identifier</td>
                  </tr>
                  <tr>
                    <td className="column-name">apiKey</td>
                    <td>
                      <span className="column-type">string</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Yes</span>
                    </td>
                    <td>Your API authentication key</td>
                  </tr>
                  <tr>
                    <td className="column-name">operation</td>
                    <td>
                      <span className="column-type">string</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Yes</span>
                    </td>
                    <td>Operation type: create, read, update, delete</td>
                  </tr>
                  <tr>
                    <td className="column-name">tableName</td>
                    <td>
                      <span className="column-type">string</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Yes</span>
                    </td>
                    <td>Target table name</td>
                  </tr>
                  <tr>
                    <td className="column-name">payload</td>
                    <td>
                      <span className="column-type">object</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Yes</span>
                    </td>
                    <td>Operation-specific data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dynamic Tables Content */}
        <div id="tablesContent">
          {tables.map((table, index) => (
            <TableSection key={index} table={table} />
          ))}
        </div>

        {/* cURL Examples */}
        <div className="curl-section fade-in">
          <div className="curl-header">
            <div className="curl-title">Examples</div>
            <div className="curl-subtitle">
              Ready-to-use cURL commands for testing your API
            </div>
          </div>
          <CurlExamples />

          <div className="response-section">
            <div className="response-example">
              <div className="response-header success-header">
                Success Response
              </div>
              <div className="response-body">{`{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sample Project",
      "description": "A sample project",
      "createdAt": "2025-09-23T10:30:00Z"
    }
  ],
  "message": "Operation completed successfully"
}`}</div>
            </div>

            <div className="response-example">
              <div className="response-header error-header">Error Response</div>
              <div className="response-body">{`{
  "success": false,
  "error": "Invalid API key or project ID",
  "code": "AUTH_ERROR",
  "details": "Please check your credentials"
}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
