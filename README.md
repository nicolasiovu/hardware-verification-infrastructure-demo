**Hardware Verification Infrastrucutre Demo For AMD**

*Overview*

This is a full stack app which employs the following workflow:

- React frontend for test triggering and data visualization
- FastAPI backend
- Backend spawns C++ multithreaded test runner
- C++ threads each execute Verilog testbenches (the same one with some randomization in this case)
- Using a Generator pattern in a Python process which spawns the C++ runner, live updates come through to the dashboard as the tests are running

[![Watch the video](https://img.youtube.com/vi/_zO66PiaDEo/maxresdefault.jpg)](https://www.youtube.com/watch?v=_zO66PiaDEo)

I created this to learn more about hardware verification infrastructure!

Although it is rather simple and merely a demo, I found this really quite interesting and fun.
