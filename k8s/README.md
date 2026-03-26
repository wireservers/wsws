# Local Kubernetes Setup

## Prerequisites

- Docker Desktop with Kubernetes enabled, OR
- [kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker)
- kubectl

## Quick Start with Docker Compose (simpler)

```bash
# From repo root
docker compose up --build
```

| Service | URL |
|---|---|
| wireservers.com | http://localhost:8080 |
| BringThe hub | http://localhost:8081 |
| BringTheDiet | http://localhost:3001 |
| react-natives docs | http://localhost:8082 |
| Food API | http://localhost:5000 |
| WS API | http://localhost:3000 |

## Kubernetes (full local cluster)

### 1. Build images

```bash
docker build -t wsws/food-api:latest ./apis/food-api
docker build -t wsws/wsapi:latest ./apis/wsapi
docker build -t wsws/wireservers-website:latest ./website/app
docker build -t wsws/bringthe-hub:latest ./bringthe/bring-the
docker build -t wsws/bringthe-diet:latest ./bringthe/bring-the-diet
docker build -t wsws/react-natives-docs:latest ./packages/react-natives/site
```

### 2. Create cluster (if using kind)

```bash
kind create cluster --name wireservers
```

### 3. Load images into kind (skip if using Docker Desktop K8s)

```bash
kind load docker-image wsws/food-api:latest --name wireservers
kind load docker-image wsws/wsapi:latest --name wireservers
kind load docker-image wsws/wireservers-website:latest --name wireservers
kind load docker-image wsws/bringthe-hub:latest --name wireservers
kind load docker-image wsws/bringthe-diet:latest --name wireservers
kind load docker-image wsws/react-natives-docs:latest --name wireservers
```

### 4. Deploy

```bash
# Update k8s/configmap.yml with your MONGO_URI first!

kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/food-api.yml
kubectl apply -f k8s/wsapi.yml
kubectl apply -f k8s/wireservers-website.yml
kubectl apply -f k8s/bringthe-hub.yml
kubectl apply -f k8s/bringthe-diet.yml
kubectl apply -f k8s/react-natives-docs.yml
```

### 5. Ingress (optional — for domain-based routing)

```bash
# Install NGINX ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for it
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s

# Apply ingress rules
kubectl apply -f k8s/ingress.yml
```

Add to `/etc/hosts`:
```
127.0.0.1 wireservers.local bringthe.local diet.bringthe.local api.wireservers.local wsapi.wireservers.local docs.reactnatives.local
```

### 6. Port forward (alternative to ingress)

```bash
kubectl port-forward -n wireservers svc/wireservers-website 8080:80 &
kubectl port-forward -n wireservers svc/bringthe-hub 8081:80 &
kubectl port-forward -n wireservers svc/bringthe-diet 3001:3001 &
kubectl port-forward -n wireservers svc/food-api 5000:5000 &
kubectl port-forward -n wireservers svc/wsapi 3000:3000 &
kubectl port-forward -n wireservers svc/react-natives-docs 8082:80 &
```

### 7. Check status

```bash
kubectl get pods -n wireservers
kubectl get svc -n wireservers
kubectl logs -n wireservers deployment/food-api
```

### Teardown

```bash
kubectl delete namespace wireservers
# or if using kind:
kind delete cluster --name wireservers
```
