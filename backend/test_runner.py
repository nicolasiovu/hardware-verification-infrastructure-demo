import subprocess
import json
from typing import Generator
import os

def run_tests() -> Generator[dict, None, None]:
    path = os.path.join(os.path.dirname(__file__), "../runner/src/test_runner")
    path = os.path.abspath(path)

    process = subprocess.Popen(
            [path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
    )

    for line in process.stdout:
        line = line.strip()
        if not line:
            continue
        try:
            yield json.loads(line)
        except json.JSONDecodeError:
            print(f"Skipping bad line: {line}")

    process.wait()
