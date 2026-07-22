# SuwaRoute
## Smart Ambulance Dispatch & Hospital Optimization Tool

> Project Development Roadmap
>
> Version: 1.0
> Status: Planning

---

# 1. Project Goal

The objective of this project is to develop an intelligent ambulance dispatch tool that minimizes emergency response time by combining:

- Graph Data Structure
- Dijkstra's Shortest Path Algorithm
- Heap-based Priority Queue
- Dynamic Ambulance Reassignment
- Hospital Capacity Optimization

Unlike traditional ambulance dispatch systems, this tool continuously monitors ambulance availability and can reassign a better ambulance before the current one reaches the patient.

---

# 2. Overall Architecture

                    React / Next.js
                           │
                           │ REST API
                           ▼
                   Spring Boot Backend
                           │
        ---------------------------------------
        |                                     |
        ▼                                     ▼
 Algorithm Engine                  Simulation Service
(Graph + Heap)                         (Go / Java)
        │                                     │
        └───────────────┬─────────────────────┘
                        ▼
                    Firebase

---

# 3. Development Phases

The project will be developed in sequential phases.

Each phase has

- Objective
- Deliverables
- Important Concepts
- Completion Criteria

Only proceed after completing the previous phase.

---

# Phase 1
## Project Foundation

## Objective

Prepare the project structure.

No algorithms yet.

No UI design.

Simply make sure every technology works.

---

## Tasks

Create Git Repository

Create

Backend

- Spring Boot

Frontend

- React / Next.js

Simulation Service

- Go (optional)

Connect Backend to Firebase.

Create basic REST endpoint.

Example

GET

/api/test

returns

Server Running

---

## Deliverables

✔ Backend running

✔ Frontend running

✔ Firebase connected

✔ API communication working

---

## Important Notes

Don't write business logic yet.

Keep everything modular.

---

# Phase 2
## Project Design

This is the most important phase.

Think before coding.

---

## Design the Database

Collections

ambulances

hospitals

emergencies

roads

roadNodes

---

### Ambulance

Fields

id

status

currentNode

latitude

longitude

speed

currentEmergency

currentRoute

---

Status

AVAILABLE

BUSY

OFFLINE

---

### Hospital

id

name

latitude

longitude

icuBeds

availableEmergencyBeds

status

---

### Emergency

id

severity

status

patientNode

assignedAmbulance

assignedHospital

timeCreated

priority

---

Road Node

id

latitude

longitude

name

---

Road Edge

fromNode

toNode

distance

trafficMultiplier

---

## Deliverables

Database finalized.

No coding changes afterwards.

---

# Phase 3
## Backend Domain Models

Create Entities

DTOs

Repositories

Services

Controllers

---

Do NOT implement algorithms.

Only CRUD.

---

Deliverables

Create Ambulance

Update Ambulance

Delete Ambulance

List Ambulances

Same for

Hospitals

Emergencies

---

Goal

Backend becomes a complete API.

---

# Phase 4
## Graph Engine

This is the first actual PDSA part.

---

Represent Colombo Road Network.

Graph

Node

Edge

Weight

---

Example

Hospital

Road Junction

Ambulance Station

Patient

Everything becomes Nodes.

Roads become Edges.

---

Build

Graph Class

Node Class

Edge Class

Graph Builder

---

Functions

addNode()

addEdge()

removeNode()

getNeighbors()

---

Goal

A complete graph exists in memory.

---

# Phase 5
## Dijkstra Algorithm

Input

Ambulance Node

Patient Node

Output

Shortest Path

Distance

ETA

---

Create

DijkstraService

Priority Queue

Visited Set

Distance Map

Parent Map

---

Return

Distance

Estimated Time

List<Node>

---

Goal

One API

/api/route

returns

Entire shortest path.

---

Testing

Try

Station

↓

Hospital

Station

↓

Patient

Patient

↓

Hospital

---

# Phase 6
## Hospital Recommendation Engine

Objective

Choose the best hospital.

---

Filter

Hospitals

↓

Available Beds

↓

ICU

↓

Distance

---

Calculate

Ambulance

↓

Patient

↓

Hospital

---

Choose

Minimum Total Travel Time

---

Goal

One endpoint

/api/recommendHospital

---

# Phase 7
## Heap Priority Queue

Second PDSA requirement.

---

Create

Emergency Priority Queue

Priority depends on

Severity

Waiting Time

---

Highest Severity

↓

Processed First

---

Methods

insert()

peek()

extract()

updatePriority()

---

Goal

Multiple emergencies handled correctly.

---

# Phase 8
## Ambulance Assignment Engine

Objective

Automatically assign

Best Ambulance

+

Best Hospital

---

Algorithm

Receive Emergency

↓

Get Available Ambulances

↓

Run Dijkstra

↓

Calculate ETA

↓

Choose Fastest

↓

Assign

↓

Reserve Ambulance

↓

Reserve Hospital

---

Goal

Complete assignment process.

---

# Phase 9
## Dynamic Ambulance Reassignment

This is the project's unique feature.

---

Trigger

Whenever

An ambulance becomes AVAILABLE

---

Workflow

Ambulance finishes task

↓

Status

AVAILABLE

↓

Search waiting emergencies

↓

Calculate ETA

↓

Compare

Current Ambulance

vs

New Ambulance

↓

If New ETA is Better

↓

Reassign

↓

Notify Frontend

---

Important Rule

Never reassign if

Current ambulance is almost at patient.

Example

Only reassign when

Improvement

>

30%

or

ETA Difference

>

2 minutes

Otherwise

Ignore.

---

Goal

Dynamic optimization.

---

# Phase 10
## Simulation Service

Objective

Animate ambulances.

---

Simulation receives

Entire Route

Node1

↓

Node2

↓

Node3

↓

Node4

---

Every few seconds

Move

Current Position

↓

Next Position

↓

Update Firestore

---

Backend never calculates animation.

Simulation Service does.

---

Goal

Realistic ambulance movement.

---

# Phase 11
## Frontend

Pages

Dashboard

Map

Ambulances

Hospitals

Emergencies

Simulation

---

Dashboard

Available Ambulances

Busy Ambulances

Hospitals

Emergencies

---

Map

Display

Hospitals

Patients

Ambulances

Routes

---

Emergency Screen

Create Emergency

↓

See Assignment

↓

Live Route

↓

ETA

---

# Phase 12
## Real-Time Synchronization

Whenever Firestore changes

↓

Frontend updates automatically.

No refresh.

---

Events

Ambulance Moving

Hospital Capacity Changed

Emergency Created

Emergency Finished

Ambulance Available

---

# Phase 13
## Logging

Store

Assignment History

Reassignment History

Hospital Selection History

Route History

Simulation Events

---

Useful for

Debugging

Demonstration

Future Analytics

---

# Phase 14
## Testing

Test

Single Emergency

Multiple Emergencies

Busy Ambulances

Hospital Full

Hospital Offline

ICU Full

Dynamic Reassignment

Traffic Multiplier

Shortest Path

Priority Queue

---

Record Results.

---

# Phase 15
## Final Improvements

Loading Animations

Statistics

Response Time Graph

Assignment History

Dark Theme

Search

Filters

Export Logs

---

# Final Demonstration Scenario

1

Three ambulances exist.

↓

2

Two hospitals exist.

↓

3

Create emergency.

↓

4

Heap prioritizes.

↓

5

Dijkstra finds route.

↓

6

Hospital selected.

↓

7

Ambulance dispatched.

↓

8

Simulation starts.

↓

9

Another ambulance becomes available.

↓

10

Dynamic reassignment occurs.

↓

11

Simulation reroutes.

↓

12

Patient reaches hospital.

↓

13

Hospital capacity updated.

↓

14

Emergency closed.

---

# Project Completion Checklist

Backend

[ ]

Frontend

[ ]

Database

[ ]

Graph

[ ]

Dijkstra

[ ]

Heap

[ ]

Assignment Engine

[ ]

Hospital Recommendation

[ ]

Simulation

[ ]

Realtime Updates

[ ]

Dynamic Reassignment

[ ]

Testing

[ ]

Presentation Ready

[ ]

Project Complete
