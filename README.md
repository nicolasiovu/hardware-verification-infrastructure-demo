# Hardware Verification Infrastructure Demo (AMD)

### Overview
This is a **full-stack application** demonstrating a simplified hardware verification infrastructure.  
It integrates several layers of the tech stack into one cohesive workflow:

- **React** frontend for test control and real-time visualization  
- **FastAPI** backend orchestrating test execution  
- **C++** multithreaded test runner for parallel execution  
- Each thread runs **Verilog testbenches** (same test with randomized parameters)  
- **Python generator** manages process spawning and streams live updates to the dashboard  

---

### 🎥 Demo

[![Watch the demo video](https://img.youtube.com/vi/_zO66PiaDEo/maxresdefault.jpg)](https://www.youtube.com/watch?v=_zO66PiaDEo)

---

### About This Project
I built this to explore how **hardware verification infrastructure** is structured in practice — from test generation to dashboard visualization.  

Although this is a simplified demo, it was a **really fun and insightful project**, blending **software engineering, parallel computing, and hardware simulation** concepts together.
