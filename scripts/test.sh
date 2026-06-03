#!/bin/bash

# Full test suite for FRIDAY backend

echo "Running backend tests..."

# Gateway tests
echo "Testing Gateway..."
uv run -C backend/gateway pytest --tb=short

# Agent tests
echo "Testing Agent..."
uv run -C backend/agent pytest --tb=short

# MCP Server tests
echo "Testing MCP Server..."
uv run -C backend/mcp_server pytest --tb=short

echo "All tests completed!"
