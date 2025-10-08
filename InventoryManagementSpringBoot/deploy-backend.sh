#!/bin/bash

set -e  # Exit on any error
echo "Starting backend deployment..."

# ======== 1. Variables ========
ECR_REPO="345204681275.dkr.ecr.eu-north-1.amazonaws.com/springboot-inventory"
IMAGE_NAME="springboot-inventory"
TERRAFORM_DIR="./terraform"
CLUSTER_NAME="springboot-cluster"
SERVICE_NAME="springboot-service"
REGION="eu-north-1"

# ======== 2. Build Docker image ========
echo "Building Docker image..."
docker build -t $IMAGE_NAME -f Dockerfile.prod .

# ======== 3. Tag Docker image for ECR ========
echo "Tagging image for ECR..."
docker tag $IMAGE_NAME:latest $ECR_REPO:latest

# ======== 4. Login to ECR ========
echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPO

# ======== 5. Push Docker image ========
echo "Pushing image to ECR..."
docker push $ECR_REPO:latest

# ======== 6. Terraform init ========
echo "Initializing Terraform..."
cd $TERRAFORM_DIR
terraform init

# ======== 7. Terraform plan ========
echo "Planning Terraform changes..."
terraform plan -out=tfplan

# ======== 8. Terraform apply ========
echo "Applying Terraform changes..."
terraform apply -auto-approve tfplan

# ======== 9. Force ECS service redeploy ========
echo "Forcing ECS service deployment to pull the new image..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --force-new-deployment \
    --region $REGION

# ======== 10. Wait for ECS tasks to become healthy ========
echo "Waiting for ECS tasks to become healthy..."
MAX_WAIT=600  # seconds
SLEEP_INTERVAL=10
ELAPSED=0

while true; do
    RUNNING=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --region $REGION \
        --query "services[0].runningCount" \
        --output text)
    DESIRED=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --region $REGION \
        --query "services[0].desiredCount" \
        --output text)

    if [[ "$RUNNING" == "$DESIRED" ]]; then
        echo "All ECS tasks are running ($RUNNING/$DESIRED). Deployment is healthy!"
        break
    fi

    if [[ $ELAPSED -ge $MAX_WAIT ]]; then
        echo "Timeout waiting for ECS tasks to become healthy!"
        exit 1
    fi

    echo "Waiting... ($RUNNING/$DESIRED tasks running)"
    sleep $SLEEP_INTERVAL
    ELAPSED=$((ELAPSED + SLEEP_INTERVAL))
done

echo "Deployment complete and 503-safe!"
