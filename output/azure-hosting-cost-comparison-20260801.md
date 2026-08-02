# Azure hosting cost comparison

Date: 2026-08-01

## Executive summary

- Keep the current App Service B2 plan unless cold starts are acceptable and the static frontends are moved to Static Web Apps.
- Do not move these workloads to AKS to save money. A single non-HA AKS node with comparable memory already costs more than the B2 plan before disks, networking, logging, and operations.
- Container Apps Consumption could reduce compute cost, potentially into the free-grant range, but only with `minReplicas: 0`. Keeping the current eight running applications warm would cost more than the shared B2 plan.

## Current state (actual Azure inventory)

- Subscription: Microsoft Partner Network
- Hosting plan: `bringthe-dev/btd-asp`
- SKU: Linux B2, one worker, 2 vCPU, 3.5 GiB RAM
- Sites: 24 total; 8 running and 16 stopped
- Existing AKS clusters: 0
- Existing Container Apps: 0
- 14-day plan utilization:
  - CPU average: 7.87%
  - Memory average: 76.66%
  - Memory maximum: 97%
  - HTTP queue maximum: 0
- 14-day running-app totals:
  - Requests: 63,077 (about 135,165 per 30 days)
  - CPU time: 16,233.88 seconds (about 34,787 seconds per 30 days)

Azure Cost Management and Consumption APIs returned no cost rows for the subscription. This report therefore distinguishes actual inventory and metrics from Microsoft retail-price estimates. The empty billing result may be related to the Microsoft Partner Network offer and must not be interpreted as proof that every resource is free.

## Validated retail pricing (West US 3, USD)

| Option | Retail basis | Estimated monthly compute |
|---|---:|---:|
| Current App Service Linux B2 | $0.034/hour x 730 hours | $24.82 |
| AKS, one Linux Standard_B2s node | $0.0416/hour x 730 hours | $30.37 before disk/network/logs |
| AKS, two Standard_B2s nodes | Same, two nodes | $60.74 before disk/network/logs |
| Container Apps, 8 minimum warm replicas (each 0.25 vCPU/0.5 GiB) | Idle rates after monthly free grants | about $45.68 plus active usage |
| Container Apps, 4 minimum warm API replicas (each 0.25 vCPU/0.5 GiB) | Idle rates after monthly free grants | about $22.03 plus active usage |
| Container Apps, scale to zero | Active allocation and requests after free grants | likely $0-$10, but requires validation |

Container Apps Consumption free grants are 180,000 vCPU-seconds, 360,000 GiB-seconds, and 2 million requests per subscription per month. Current request count and measured CPU time are below those grants, but App Service CPU time is not identical to Container Apps billable active allocation. A load test or short canary is required for a defensible estimate.

Likely extras for Container Apps include a container registry (about $5/month if using Basic Azure Container Registry) and variable Log Analytics ingestion. External registries can change the registry cost.

## Recommendation

1. Keep App Service for now. At about $25/month it is inexpensive, and memory utilization shows the shared plan is doing useful consolidation work.
2. Move static frontends to Azure Static Web Apps Free where feature limits fit. Candidate running frontends are `reactnatives`, `wireservers-security-web`, `bring-the-diet-web`, and `bring-the-budget`.
3. Canary one low-risk API in Container Apps Consumption with `minReplicas: 0`, capped logging, and the smallest safe memory allocation. Measure cold-start latency and actual billed vCPU/GiB seconds for 7-14 days.
4. Consider migrating the remaining APIs only if the canary projects total hosting below roughly $15/month including registry and logs. This leaves enough margin to justify the added deployment complexity.
5. Use AKS only for Kubernetes capabilities, not savings. It would add cluster upgrades, node patching, ingress, storage, observability, and capacity management for no likely cost advantage at this scale.

## Sources

- Azure Retail Prices API: https://prices.azure.com/api/retail/prices
- App Service pricing: https://azure.microsoft.com/en-us/pricing/details/app-service/linux/
- Container Apps pricing: https://azure.microsoft.com/en-us/pricing/details/container-apps/
- AKS pricing: https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/
