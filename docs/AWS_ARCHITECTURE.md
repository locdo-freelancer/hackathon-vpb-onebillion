# AWS Architecture Documentation

## 🏗️ Overview

This document describes the AWS cloud architecture integration for the SecureVault cybersecurity management platform. The system uses a microservices architecture with event-driven processing to handle high-volume security data ingestion, analysis, and response workflows.

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SECUREVAULT AWS ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │  Mobile Apps    │    │  Agent Clients  │
│   (Next.js)     │    │   (React)       │    │   (Go/Python)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │     ALB / CloudFront     │
                    │    (Load Balancing)      │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │      ECS Fargate         │
                    │   (NestJS API Gateway)   │
                    │                          │
                    │  ┌─────┐ ┌─────┐ ┌─────┐ │
                    │  │ API │ │ API │ │ API │ │
                    │  │Task1│ │Task2│ │Task3│ │
                    │  └─────┘ └─────┘ └─────┘ │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │         SQS              │
                    │   (Message Queuing)      │
                    │                          │
                    │ ┌─────────────────────┐  │
                    │ │   Events Queue      │  │
                    │ │  Notifications Q    │  │
                    │ │  Enrichment Queue   │  │
                    │ └─────────────────────┘  │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │      EventBridge         │
                    │  (Workflow Orchestration)│
                    └────────────┬─────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐    ┌─────────▼────────┐    ┌─────────▼────────┐
│  Lambda Workers │    │   Lambda Workers  │    │  Lambda Workers  │
│                 │    │                   │    │                  │
│ ┌─────────────┐ │    │ ┌───────────────┐ │    │ ┌──────────────┐ │
│ │ Enrichment  │ │    │ │  AI Triage    │ │    │ │  Notifier    │ │
│ │   Worker    │ │    │ │   Worker      │ │    │ │   Worker     │ │
│ └─────────────┘ │    │ └───────────────┘ │    │ └──────────────┘ │
└────────────────┘     └──────────────────┘     └──────────────────┘
        │                        │                        │
        │              ┌─────────▼─────────┐              │
        │              │       S3          │              │
        │              │  (Object Storage) │              │
        │              │                   │              │
        │              │ ┌───────────────┐ │              │
        │              │ │   Raw Logs    │ │              │
        │              │ │  Attachments  │ │              │
        │              │ │ AI Analysis   │ │              │
        │              │ │Threat Intel   │ │              │
        │              │ └───────────────┘ │              │
        │              └─────────────────────              │
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
               ┌─────────────────▼──────────────────┐
               │          ElastiCache               │
               │         (Redis Cluster)            │
               │                                    │
               │ ┌─────────────────────────────────┐│
               │ │    Enrichment Cache            ││
               │ │    Session Storage             ││
               │ │    Rate Limiting               ││
               │ │    Real-time Pub/Sub           ││
               │ └─────────────────────────────────┘│
               └────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SUPPORTING SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Secrets Manager │  │   CloudWatch    │  │       RDS       │                │
│  │                 │  │                 │  │                 │                │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │                │
│  │ │ API Keys    │ │  │ │   Metrics   │ │  │ │  PostgreSQL │ │                │
│  │ │ JWT Secrets │ │  │ │    Logs     │ │  │ │   Database  │ │                │
│  │ │ DB Config   │ │  │ │   Alarms    │ │  │ │             │ │                │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🏭 Core Components

### 1. API Gateway (ECS Fargate)
- **Technology**: NestJS running on ECS Fargate
- **Purpose**: Handle REST API requests, authentication, and route to appropriate services
- **Scaling**: Auto-scaling based on CPU/memory utilization
- **Load Balancing**: Application Load Balancer with health checks

### 2. Message Queuing (SQS)
- **Queues**:
  - `securevault-events`: General system events
  - `securevault-notifications`: User notifications
  - `securevault-enrichment`: Threat intelligence requests
- **Benefits**: Decoupling, resilience, guaranteed delivery
- **Dead Letter Queues**: Error handling and poison message management

### 3. Workflow Orchestration (EventBridge)
- **Purpose**: Coordinate complex workflows across Lambda functions
- **Event Types**:
  - Log Ingestion Workflow
  - Incident Response Workflow  
  - Threat Detection Workflow
  - Notification Delivery Workflow
- **Routing**: Rule-based event routing to appropriate handlers

### 4. Processing Workers (Lambda Functions)

#### Enrichment Worker
- **Trigger**: SQS enrichment queue
- **Function**: Query external threat intelligence sources
- **Sources**: VirusTotal, AbuseIPDB, custom feeds
- **Output**: Enriched threat data stored in S3 and cached in Redis

#### AI Triage Worker
- **Trigger**: SQS events queue / EventBridge
- **Function**: AI-powered analysis and classification
- **Capabilities**:
  - Log parsing and IOC extraction
  - Incident severity scoring
  - Automated response recommendations
- **AI Models**: OpenAI GPT for text analysis

#### Notifier Worker
- **Trigger**: SQS notifications queue
- **Function**: Multi-channel notification delivery
- **Channels**: Email, Slack, SMS, in-app notifications
- **Priority Routing**: Different channels based on severity

### 5. Storage Systems

#### S3 (Object Storage)
- **Buckets**:
  - `securevault-logs`: Raw log storage
  - `securevault-attachments`: Incident attachments
  - `securevault-analysis`: AI analysis results
  - `securevault-threat-intel`: Threat intelligence data
- **Lifecycle Policies**: Automatic archiving to IA/Glacier
- **Encryption**: Server-side encryption with KMS

#### ElastiCache (Redis)
- **Use Cases**:
  - Enrichment result caching (24h TTL)
  - User session storage
  - Rate limiting counters
  - Real-time pub/sub for WebSocket notifications
- **Clustering**: Multi-AZ for high availability

#### RDS (PostgreSQL)
- **Purpose**: Primary database for structured data
- **Features**: Multi-AZ deployment, automated backups
- **Tables**: Users, Sites, Incidents, Threats, Vulnerabilities, etc.

### 6. Security & Configuration

#### Secrets Manager
- **Stored Secrets**:
  - External API keys (VirusTotal, AbuseIPDB, OpenAI)
  - Database credentials
  - JWT signing keys
  - Webhook URLs
- **Rotation**: Automatic secret rotation where supported

#### CloudWatch
- **Monitoring**:
  - Application metrics
  - Custom security metrics
  - Lambda function performance
  - API Gateway requests
- **Alerting**: CloudWatch Alarms for critical thresholds

## 🔄 Workflow Examples

### Log Ingestion Workflow
```
1. Agent sends log data → API Gateway
2. API stores raw log → S3
3. API sends event → SQS Events Queue
4. EventBridge triggers → Log Ingestion Workflow
5. AI Triage Worker → Extracts IOCs, classifies severity
6. If IOCs found → Enrichment Worker queries threat intel
7. If high severity → Incident created + Notifications sent
8. Results cached → Redis for fast lookup
```

### Incident Response Workflow
```
1. Incident created → API Gateway
2. Incident stored → PostgreSQL
3. If critical/high → Immediate notification workflow
4. EventBridge → Incident Workflow orchestration
5. AI Triage → Recommended response actions
6. Enrichment → Context gathering from external sources
7. Notifier → Alert security team via multiple channels
8. Updates published → WebSocket for real-time UI updates
```

### Threat Detection Workflow
```
1. Threat indicator → API Gateway
2. Indicator stored → PostgreSQL
3. EventBridge → Threat Detection Workflow
4. Enrichment Worker → Query VirusTotal, AbuseIPDB
5. Results cached → Redis
6. If high confidence → Auto-create incident
7. Notifications → Based on threat severity
8. Intelligence stored → S3 for historical analysis
```

## 🚀 Deployment Architecture

### Development Environment
- Local NestJS development server
- LocalStack for AWS service emulation
- Docker Compose for dependencies (PostgreSQL, Redis)

### Staging Environment
- ECS Fargate with 1-2 tasks
- Smaller instance sizes
- Shared RDS instance
- Basic monitoring

### Production Environment
- ECS Fargate with auto-scaling (2-10 tasks)
- Multi-AZ RDS deployment
- ElastiCache cluster
- Full CloudWatch monitoring and alerting
- WAF for API protection

## 📊 Scalability Considerations

### Horizontal Scaling
- **API Gateway**: ECS auto-scaling based on metrics
- **Lambda Workers**: Automatic concurrency scaling
- **SQS**: Virtually unlimited message capacity
- **S3**: Unlimited storage capacity

### Performance Optimization
- **Caching**: Redis for frequently accessed data
- **CDN**: CloudFront for static assets
- **Database**: Read replicas for query scaling
- **Connection Pooling**: Optimized database connections

### Cost Optimization
- **Reserved Instances**: For predictable workloads
- **Spot Instances**: For batch processing
- **S3 Lifecycle**: Automatic archiving of old data
- **Lambda**: Pay-per-execution model for workers

## 🔐 Security Implementation

### Network Security
- **VPC**: Private subnets for database and cache
- **Security Groups**: Restrictive ingress/egress rules
- **WAF**: Protection against common attacks
- **ALB**: SSL termination and security headers

### Data Security
- **Encryption at Rest**: S3, RDS, ElastiCache
- **Encryption in Transit**: TLS for all communications
- **IAM Roles**: Least privilege access
- **Secrets Management**: No hardcoded credentials

### Compliance
- **Audit Logging**: CloudTrail for all API calls
- **Data Retention**: Configurable retention policies
- **Access Controls**: Role-based access control (RBAC)
- **Incident Response**: Automated detection and alerting

## 📈 Monitoring & Observability

### Metrics
- **Application Metrics**: Response times, error rates
- **Business Metrics**: Incident count, threat detection rate
- **Infrastructure Metrics**: CPU, memory, network usage
- **Custom Metrics**: Security-specific KPIs

### Logging
- **Structured Logging**: JSON format for easy parsing
- **Centralized Logs**: CloudWatch Logs aggregation
- **Log Levels**: Debug, Info, Warn, Error
- **Retention**: Configurable log retention periods

### Alerting
- **Critical Alerts**: High-severity incidents, system failures
- **Warning Alerts**: Resource utilization thresholds
- **Notification Channels**: Email, Slack, PagerDuty
- **Escalation**: Automated escalation procedures

## 🛠️ Configuration Management

### Environment Variables
All configuration is managed through environment variables and AWS Parameter Store:

```bash
# AWS Configuration
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# SQS Queues
AWS_SQS_QUEUE_URL_EVENTS=https://sqs.region.amazonaws.com/account/securevault-events
AWS_SQS_QUEUE_URL_NOTIFICATIONS=https://sqs.region.amazonaws.com/account/securevault-notifications
AWS_SQS_QUEUE_URL_ENRICHMENT=https://sqs.region.amazonaws.com/account/securevault-enrichment

# S3 Buckets
AWS_S3_BUCKET_NAME=securevault-main-bucket
AWS_S3_BUCKET_LOGS=securevault-logs-bucket
AWS_S3_BUCKET_ATTACHMENTS=securevault-attachments-bucket

# Lambda Functions
AWS_LAMBDA_ENRICHMENT_FUNCTION=securevault-enrichment-worker
AWS_LAMBDA_AI_TRIAGE_FUNCTION=securevault-ai-triage-worker
AWS_LAMBDA_NOTIFIER_FUNCTION=securevault-notifier-worker

# EventBridge
AWS_EVENTBRIDGE_BUS_NAME=securevault-event-bus
AWS_EVENTBRIDGE_SOURCE=securevault.system

# Redis Configuration
REDIS_HOST=securevault-cache.abc123.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Secrets Manager
AWS_SECRET_VIRUSTOTAL_API=securevault/virustotal-api-key
AWS_SECRET_ABUSEIPDB_API=securevault/abuseipdb-api-key
AWS_SECRET_OPENAI_API=securevault/openai-api-key
AWS_SECRET_SLACK_WEBHOOK=securevault/slack-webhook-url
```

## 🔧 Development Workflows

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Start LocalStack: `docker-compose up localstack`
4. Configure environment: Copy `.env.example` to `.env`
5. Start development server: `npm run start:dev`

### Testing
1. Unit tests: `npm run test`
2. Integration tests: `npm run test:e2e`
3. AWS integration tests: `npm run test:aws` (requires AWS credentials)

### Deployment
1. Build application: `npm run build`
2. Build Docker image: `docker build -t securevault-api .`
3. Push to ECR: `aws ecr get-login-password | docker login`
4. Deploy to ECS: `aws ecs update-service --cluster securevault --service api`

## 📚 API Documentation

### AWS-Specific Endpoints

#### Workflow Management
- `POST /aws/workflows/log-ingestion` - Trigger log processing workflow
- `POST /aws/workflows/bulk-enrichment` - Bulk threat intelligence enrichment
- `POST /aws/workflows/notification` - Send notifications

#### Health & Monitoring
- `GET /aws/health` - Overall AWS services health check
- `GET /aws/health/redis` - Redis connection status
- `GET /aws/health/circuit-breakers` - Circuit breaker status
- `GET /aws/health/configuration` - AWS configuration validation

### Enhanced Existing Endpoints
All existing endpoints now include AWS integration:
- Incident creation triggers AWS workflow
- Threat detection includes enrichment processing  
- Notifications use multi-channel delivery
- Real-time updates via Redis pub/sub

## 🎯 Benefits of AWS Architecture

### Scalability
- **Auto-scaling**: Automatic resource adjustment based on demand
- **Global Scale**: CloudFront CDN for worldwide performance
- **Elastic Processing**: Lambda scales to handle traffic spikes

### Reliability
- **Multi-AZ**: High availability across availability zones
- **Circuit Breakers**: Automatic failure handling
- **Dead Letter Queues**: Message durability and error recovery

### Security
- **IAM Integration**: Fine-grained access control
- **Encryption**: Data protected at rest and in transit
- **Compliance**: SOC, ISO, PCI compliance inherited from AWS

### Cost Efficiency
- **Pay-as-you-go**: Only pay for resources used
- **Serverless**: No idle server costs for Lambda functions
- **Storage Optimization**: Automatic data lifecycle management

### Developer Experience
- **Managed Services**: Less infrastructure management overhead
- **Monitoring**: Built-in observability and alerting
- **Integration**: Native AWS service integration