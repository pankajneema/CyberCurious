# Background Workers

Hardcore backend services - No API/UI connection

These workers run in the background and process jobs from queues.

## ASM Worker

- Processes ASM discovery jobs
- Performs actual discovery (DNS, ports, services)
- Updates database with discovered assets
- No direct API connection

## VS Worker

- Processes vulnerability scan jobs
- Runs actual scanners (nmap, trivy, etc.)
- Parses and stores results
- No direct API connection

## Running Workers

```bash
# ASM Worker
cd backend/workers
python3 asm_worker.py

# VS Worker
python3 vs_worker.py
```

Workers communicate via:
- Queue (Redis/RabbitMQ) - for job distribution
- Database - for storing results
- No HTTP/API endpoints

