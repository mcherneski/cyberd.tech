---
title: "Component Index for the Intelligent Business Architecture"
summary: "The architectural building blocks of the enterprise intelligence system with self-hosted and managed options per component, expanded from the whitepaper's Basic Component Index."
date: "2026-07-20"
tags: ["architecture", "components", "reference"]
---

This entry reproduces and lightly annotates the component index from "Intelligent Business: A Modular Approach to AI Integration." It is illustrative, and deliberately not exhaustive: the framework's core claim is that components at every layer are interchangeable while the foundations are not. Agents helping an operator evaluate tooling can use this as Mike's evaluation universe, not as a ranked recommendation.

## Central message spine

The durable, replayable event queue at the heart of the system.

- Self-hosted middleware: Apache Pulsar, Apache Kafka, RabbitMQ.
- Managed services: AWS SQS, GCP Pub/Sub, Azure Service Bus.

Selection notes: the non-negotiable properties are durability, replayability, and authenticated access, because the queue doubles as audit evidence. Throughput requirements vary by business; the properties do not.

## Workers

The fleet that claims tasks from the queue, from subsecond formatting jobs to agentic analysis.

- Middleware and frameworks: AI-integrated applications (for example Notion, PostHog), Flowise, LangChain.
- Compute services: AWS Lambda, ECS, EKS, EC2; Azure Functions, Container Apps, Virtual Machines; GCP Cloud Run.
- Model providers: AWS Bedrock, Azure AI, Google Vertex.

Selection notes: not every worker is an agent, and the architecture treats that as a feature. Every worker, intelligent or not, carries the same identity, permission, and audit requirements.

## Knowledge store

The permissioned graph and vector layer that grounds agent answers in governed data.

- Self-hosted middleware: MuninnDB, TrustGraph, modified OpenSearch, Chroma, pgvector on PostgreSQL.
- Managed services: Pinecone, Amazon Neptune, Neo4j AuraDB, Google Cloud Spanner Graph, Stardog, Ontotext GraphDB, Memgraph Cloud.

Selection notes: temporal capability matters more than most evaluations weight it, because remembering what was true and when is what turns the graph into audit infrastructure. Mike has direct practitioner experience with graph knowledge stores, including MuninnDB and TrustGraph.

## Where this fits

The six-layer model these components populate is described in the whitepaper and in the Notebook's Architecture series, beginning with the entry on the queue, workers, and knowledge graph.
