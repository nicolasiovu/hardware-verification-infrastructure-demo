from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db, get_db_connection
from .models import BatchResponse, TestResponse, BatchTestsResponse
from .test_runner import run_tests
from datetime import datetime
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

@app.post("/run-new-batch")
async def run_new_batch(background_tasks: BackgroundTasks):
    """Create a new batch and start running tests in background"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    batch_name = f"Test Batch {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    cursor.execute(
        "INSERT INTO Batch (name, date, is_complete) VALUES (%s, %s, %s)",
        (batch_name, datetime.now(), False)
    )
    conn.commit()
    batch_id = cursor.lastrowid
    
    cursor.close()
    conn.close()
    
    # Start background test runner
    background_tasks.add_task(simulate_test_runner, batch_id)
    
    return {"status": "started", "batch_id": batch_id}

@app.get("/get-tests-from-batch/{batch_id}")
async def get_tests_from_batch(batch_id: int):
    """Get all tests from a specific batch with statistics"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Get batch info
    cursor.execute("SELECT * FROM Batch WHERE id = %s", (batch_id,))
    batch = cursor.fetchone()
    
    if not batch:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Get all tests for this batch
    cursor.execute(
        "SELECT * FROM Test WHERE batch_id = %s ORDER BY timestamp",
        (batch_id,)
    )
    tests = cursor.fetchall()
    
    # Calculate statistics
    total_tests = len(tests)
    passed_tests = sum(1 for t in tests if t['status'] == 'pass')
    failed_tests = total_tests - passed_tests
    pass_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
    
    # Find most common failure reason
    failure_reasons = [t['failure_reason'] for t in tests if t['failure_reason']]
    most_common_failure = None
    if failure_reasons:
        most_common_failure = max(set(failure_reasons), key=failure_reasons.count)
    
    cursor.close()
    conn.close()
    
    return {
        "batch": batch,
        "tests": tests,
        "is_complete": batch['is_complete'],
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "failed_tests": failed_tests,
        "pass_rate": round(pass_rate, 2),
        "most_common_failure": most_common_failure
    }

@app.get("/examine-test/{test_id}")
async def examine_test(test_id: int):
    """Get detailed information about a specific test"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM Test WHERE id = %s", (test_id,))
    test = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    return test

@app.get("/get-all-batches")
async def get_all_batches():
    """Get all batches for examination"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM Batch ORDER BY date DESC")
    batches = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {"batches": batches}

def simulate_test_runner(batch_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        for result in run_tests():
            status = result.get("result", "FAIL").lower()
            reason = result.get("reason", None)
            runtime = random.uniform(0.1, 2.5)

            cursor.execute(
                """
                INSERT INTO Test (batch_id, name, timestamp, status, runtime, failure_reason)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    batch_id,
                    f"Test {result.get('id', 'unknown')}",
                    datetime.now(),
                    status,
                    runtime,
                    reason
                )
            )

            conn.commit()

        cursor.execute("UPDATE Batch SET is_complete = TRUE WHERE id = %s", (batch_id,))
        conn.commit()

    except Exception as e:
        print(f"Error on batch {batch_id}: {e}")

    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
