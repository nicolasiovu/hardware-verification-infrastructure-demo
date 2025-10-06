from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class BatchResponse(BaseModel):
    id: int
    name: str
    date: datetime
    is_complete: bool

class TestResponse(BaseModel):
    id: int
    batch_id: int
    name: str
    timestamp: datetime
    status: str
    runtime: float
    failure_reason: Optional[str]

class BatchTestsResponse(BaseModel):
    batch: BatchResponse
    tests: List[TestResponse]
    is_complete: bool
    total_tests: int
    passed_tests: int
    failed_tests: int
    pass_rate: float
    most_common_failure: Optional[str]

