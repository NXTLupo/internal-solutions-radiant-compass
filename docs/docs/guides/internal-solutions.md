# Internal Solutions Deployment Guide

## Overview

At NXT Humans, we host all internal solution projects in Azure Container Apps, providing a scalable and managed environment for our containerized applications. This document outlines our deployment process, required configurations, and best practices to ensure smooth deployment of internal solutions.

## CI/CD Infrastructure

We utilize GitHub Actions as our primary CI/CD pipeline for automating the build, test, and deployment processes. This approach ensures consistency and reliability across all deployments while minimizing manual intervention.

## Prerequisites

Before deploying an application, ensure the following requirements are met:

- The application must have a functioning Dockerfile or multiple Dockerfiles for multi-container applications
- A properly configured `compose.yml` file must be present in the repository
- The repository should be set up with the necessary GitHub secrets (detailed below)

## Organization-Level Secrets

We maintain organization-level secrets in GitHub for secure access to our Azure infrastructure. These secrets are configured for a single resource group, service principal, and Azure Container Registry (ACR). The following secrets are available to private repositories:

- `AZURE_CREDENTIALS_AIPLAYGROUND`: Contains the Azure service principal credentials
- `REGISTRY_LOGIN_SERVER_AIPLAYGROUND`: The URL for our Azure Container Registry
- `REGISTRY_USERNAME_AIPLAYGROUND`: Username for ACR authentication
- `REGISTRY_PASSWORD_AIPLAYGROUND`: Password for ACR authentication
- `RESOURCE_GROUP_AIPLAYGROUND`: The name of our Azure resource group
- `AZURE_SUBSCRIPTION_ID`: The subscription ID of our Azure instance

## Deployment Workflow Template

Use the following GitHub Action workflow as a template for deploying your application to Azure Container Apps:

```yaml title="github-workflow.yml" linenums="1"
name: Deploy to Azure Container Apps

on:
  workflow_dispatch:
  push:
    branches:
      - main

env:
  SUBSCRIPTION_ID: '${{ secrets.AZURE_SUBSCRIPTION_ID }}'
  REGISTRY: '${{ secrets.REGISTRY_LOGIN_SERVER_AIPLAYGROUND }}'
  RESOURCE_GROUP: '${{ secrets.RESOURCE_GROUP_AIPLAYGROUND }}'
  CONTAINER_APP_NAME: 'image-filter'  # (1)!
  ENVIRONMENT_NAME: 'image-filter-env'  # (2)!
  LOCATION: 'eastus2'
  CONTAINERAPP_YAML_PATH: '${{ github.workspace }}/containerapp.yaml'
  COMMIT_SHA: '${{ github.sha }}'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4.2.2

      - name: Azure Login
        uses: azure/login@v2.3.0
        with:
          creds: '${{ secrets.AZURE_CREDENTIALS_AIPLAYGROUND }}'

      - name: Docker Login to ACR
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD_AIPLAYGROUND }} | docker login $REGISTRY --username ${{ secrets.REGISTRY_USERNAME_AIPLAYGROUND }} --password-stdin

      - name: Create .env file for Docker Compose
        run: |
          echo "REGISTRY=$REGISTRY" >> .env
          echo "COMMIT_SHA=${COMMIT_SHA}" >> .env

      - name: Ensure Container App Environment exists
        uses: azure/CLI@v2.1.0
        with:
          inlineScript: |
            ENV_ID=$(az containerapp env show \
              --name $ENVIRONMENT_NAME \
              --resource-group $RESOURCE_GROUP \
              --query id -o tsv 2>/dev/null || echo "")
            if [ -z "$ENV_ID" ]; then
              echo "Creating Container App Environment..."
              az containerapp env create \
                --name $ENVIRONMENT_NAME \
                --resource-group $RESOURCE_GROUP \
                --location $LOCATION
            else
              echo "Container App Environment already exists."
            fi

      - name: Build containers with Docker Compose
        run: |
          docker compose build

      - name: Push containers with Docker Compose
        run: |
          docker compose push

      - name: Update containerapp.yaml token placeholders
        run: |
          sed -i "s|IMAGE_TAG_APP|${COMMIT_SHA}|g" $CONTAINERAPP_YAML_PATH
          sed -i "s|SUBSCRIPTION_ID|${SUBSCRIPTION_ID}|g" $CONTAINERAPP_YAML_PATH
          sed -i "s|RESOURCE_GROUP|${RESOURCE_GROUP}|g" $CONTAINERAPP_YAML_PATH
          sed -i "s|ENVIRONMENT_NAME|${ENVIRONMENT_NAME}|g" $CONTAINERAPP_YAML_PATH
          sed -i "s|REGISTRY|${REGISTRY}|g" $CONTAINERAPP_YAML_PATH

      - name: Deploy to Azure Container Apps
        uses: azure/container-apps-deploy-action@v2
        with:
          resourceGroup: '${{ env.RESOURCE_GROUP }}'
          location: '${{ env.LOCATION }}'
          containerAppEnvironment: '${{ env.ENVIRONMENT_NAME }}'
          containerAppName: '${{ env.CONTAINER_APP_NAME }}'
          yamlConfigPath: '${{ env.CONTAINERAPP_YAML_PATH }}'
          acrName: nxthumans  # (3)!
          acrUsername: '${{ secrets.REGISTRY_USERNAME_AIPLAYGROUND }}'
          acrPassword: '${{ secrets.REGISTRY_PASSWORD_AIPLAYGROUND }}'
```

1. Change this to your application name
2. Change this to your environment name
3. Must match your ACR name without the full URL

!!! tip "Workflow Configuration Requirements"

    - **Required Environment Variables to Update:**
        - `CONTAINER_APP_NAME`: **MUST BE UPDATED** to match your specific application name
        - `ENVIRONMENT_NAME`: **MUST BE UPDATED** to a unique environment name for your app
        - `LOCATION`: Can be adjusted based on deployment region requirements

    - **Critical Variable Relationships:**
        - The `CONTAINER_APP_NAME` must match the container name used in your `containerapp.yaml` file
        - The `ENVIRONMENT_NAME` must be consistent between GitHub workflow and all configuration files
        - The image name in `docker-compose.yml` must match the image name in `containerapp.yaml`
        - The `acrName: nxthumans` parameter must match your ACR name without the full URL

    - **Automatic Placeholder Replacement:**
        - The workflow automatically replaces all placeholders in your `containerapp.yaml` with actual values:
            - `IMAGE_TAG_APP` → Current commit SHA for versioning
            - `SUBSCRIPTION_ID` → Your Azure subscription ID 
            - `RESOURCE_GROUP` → Resource group name
            - `ENVIRONMENT_NAME` → Container App environment name
            - `REGISTRY` → Your ACR URL
  
    - **Security Note:**
        - All sensitive information is stored in GitHub secrets
        - Never hardcode credentials or sensitive configuration in your workflow files

## Required Configuration Files

### Docker Compose Template

Create a `docker-compose.yml` file in your repository's root directory. This example demonstrates a multi-container setup with dynamic image tagging using environment variables that will be populated by the GitHub Actions workflow and also function properly during local development:

```yaml title="docker-compose.yml" linenums="1" hl_lines="5"
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: ${REGISTRY:-}${REGISTRY:+/}image-filter-app:${COMMIT_SHA:-local-dev}
    ports:
      - "8081:80"
    environment:
      - ENV=production
    volumes:
      - ./static:/app/static
      - ./templates:/app/templates
```

!!! info "Key Components to Configure"

    - **Image Name:** The `image-filter-app` portion in the image tag must be changed to match your application name. This must be identical to the image name specified in your `containerapp.yaml` file.
    - **Dynamic Registry Prefix:** The `${REGISTRY:-}${REGISTRY:+/}` syntax allows the compose file to work both locally (without a registry prefix) and in CI/CD (with the registry prefix).
    - **Image Versioning:** The `${COMMIT_SHA:-local-dev}` tag ensures each deployment uses a unique image tag in production while using a consistent tag for local development.
    - **Port Mapping:** Update the port mapping to match your application's requirements. The format is `"host:container"`.
    - **Volumes:** Customize the volume mounts based on your application's needs. These will not be used in the Azure Container App deployment but are useful for local development.

### Container App Configuration Template

Create a `containerapp.yaml` file at the repository root (or in the location specified by `CONTAINERAPP_YAML_PATH` in your workflow):

```yaml title="containerapp.yaml" linenums="1" hl_lines="17 18"
properties:
  managedEnvironmentId: /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.App/managedEnvironments/ENVIRONMENT_NAME
  configuration:
    ingress:
      external: true
      allowInsecure: false
      targetPort: 80
    registries:
      - server: REGISTRY
        identity: /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ACR_with_pull_policy

  identity:
    type: UserAssigned
    userAssignedIdentities: /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ACR_with_pull_policy

  template:
    containers:
      - image: REGISTRY/image-filter-app:IMAGE_TAG_APP
        name: image-filter-app
        resources:
          cpu: 0.5
          memory: 1Gi
```

!!! warning "Critical Configuration Parameters"

    - **Placeholder Variables:** The following placeholders will be automatically replaced by the GitHub workflow:
        - `SUBSCRIPTION_ID`: Your Azure subscription ID
        - `RESOURCE_GROUP`: The resource group name from GitHub secrets
        - `ENVIRONMENT_NAME`: The Container App environment name set in workflow env vars
        - `REGISTRY`: The ACR URL from GitHub secrets
        - `IMAGE_TAG_APP`: Will be replaced with the commit SHA for version tracking

    - **Image Configuration:**
        - The `image: REGISTRY/image-filter-app:IMAGE_TAG_APP` path **must** use the same base name as in your `docker-compose.yml` file
        - Update `name: image-filter-app` to match your application's name (should match the container name)

    - **Ingress Settings:**
        - `external: true` makes your app publicly accessible
        - `targetPort: 80` should match the internal port your container exposes (not the host port from docker-compose)

    - **Resource Allocation:**
        - Adjust `cpu` and `memory` values based on your application's requirements
        - For most internal applications, the default values are sufficient but can be increased for more demanding workloads

## Deployment Process Explained

### 1. Authentication and Setup

The workflow begins by authenticating with both Azure and the Azure Container Registry:

- Azure Login: Authenticates with Azure using the provided service principal credentials
- Docker Login: Logs into the Azure Container Registry to enable pushing container images
- Environment File Creation: Generates a `.env` file with registry and commit information for Docker Compose

### 2. Environment Preparation

The workflow checks if the specified Azure Container App environment exists and creates it if needed. This ensures your application has the required hosting environment.

### 3. Container Build and Publication

The process builds and publishes your containers:

- Docker Compose Build: Builds all services defined in your `docker-compose.yml` file
- Docker Compose Push: Pushes the built images to your Azure Container Registry
- Image Tag Updates: Updates the deployment YAML with the current commit SHA for proper versioning

### 4. Deployment

Finally, the workflow uses the Azure Container Apps deploy action to deploy the multi-container configuration to Azure Container Apps.

## Implementation Notes

!!! example "Best Practices"
    When implementing this workflow in your repository, remember to:

    1. Replace placeholder values with your actual Azure resource names
    2. Update the container names and resource requirements in `containerapp.yaml` to match your application needs
    3. Adjust environment variables in both the workflow and Docker Compose files
    4. Ensure your Dockerfiles are optimized for production use
    5. Consider adding testing steps before deployment for greater reliability

## Troubleshooting

!!! question "Common Issues"
    If you encounter issues during deployment:

    1. Verify that all required secrets are properly configured in your repository
    2. Check that your Dockerfiles build successfully locally before attempting deployment
    3. Examine the GitHub Actions logs for specific error messages
    4. Confirm that your service principal has the necessary permissions to deploy to Azure Container Apps

    For further assistance, contact the DevOps team through the usual support channels!

## Cross-File Consistency Requirements

!!! danger "Critical Configuration Consistency"
    To ensure successful deployment, several values must be consistent across multiple configuration files:

    | Value | GitHub Workflow | docker-compose.yml | containerapp.yaml |
    |-------|----------------|-------------------|-------------------|
    | Container/App Name | `CONTAINER_APP_NAME` env var | Image name in `image:` tag | Container name in `name:` field and image path |
    | Environment Name | `ENVIRONMENT_NAME` env var | N/A | Referenced in `managedEnvironmentId` path |
    | Image Name | N/A | Must match between compose and containerapp.yaml | Must match between compose and containerapp.yaml |
    | Registry | Uses `REGISTRY` from secrets | Referenced via `${REGISTRY:-}${REGISTRY:+/}` | Uses placeholder `REGISTRY` that gets replaced |

!!! bug "Common Mistakes to Avoid"

    1. Inconsistent image names between `docker-compose.yml` and `containerapp.yaml`
    2. Forgetting to update the `CONTAINER_APP_NAME` and `ENVIRONMENT_NAME` in the GitHub workflow
    3. Incorrect `acrName` value in the deployment action 
    4. Mismatched port configurations between container exposure and ingress settings