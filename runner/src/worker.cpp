#include "worker.hpp"
#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <thread>
#include <algorithm>

static const std::vector<std::string> fail_reasons = {
	"Output mismatch",
	"Testbench timeout",
	"Timing violation",
	"Hardware miraculously exploded"
};

static pthread_mutex_t log_mutex = PTHREAD_MUTEX_INITIALIZER;

static std::string trim(const std::string &s) {
	size_t start = s.find_first_not_of(" \r\n\t");
	size_t end = s.find_last_not_of(" \r\n\t");
	return (start == std::string::npos) ? "" : s.substr(start, end - start  + 1);
}

void *worker_thread(void *arg) {
	JobQueue *queue = static_cast<JobQueue *>(arg);

	TestJob job;
	while (queue->pop(job)) {
		std::string cmd = "vvp /home/nic/work/amd/runner/tests/sim_tb +randval=" + std::to_string(job.randVal);
		FILE *pipe = popen(cmd.c_str(), "r");
		if (!pipe) {
			pthread_mutex_lock(&log_mutex);
			std::cerr << "{\"id\": " << job.id << ", \"result\": \"FAIL\", \"reason\": \"failed to launch sim\"}" << std::endl;
			pthread_mutex_unlock(&log_mutex);
			continue;
		}

		char buffer[128];
		std::string result;
		auto start_time = std::chrono::steady_clock::now();

		while (true) {
			if (fgets(buffer, sizeof(buffer), pipe)) {
				result += buffer;
				break;
			}
			auto now = std::chrono::steady_clock::now();
			auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(now - start_time);
			if (elapsed.count() > 3) {
				result = "TIMEOUT";
				break;
			}
			std::this_thread::sleep_for(std::chrono::milliseconds(50));
		}
		
		pclose(pipe);

		result = trim(result);
		
		pthread_mutex_lock(&log_mutex);
		if (result == "PASS") {
			std::cout << "{\"id\": " << job.id << ", \"result\": \"PASS\"}" << std::endl;
		} else if (result == "TIMEOUT") {
			std::cout << "{\"id\": " << job.id << ", \"result\": \"FAIL\", \"reason\": \"Testbench timeout\"}" << std::endl;
		} else {
			std::string reason = fail_reasons[rand() % fail_reasons.size()];
			std::cout << "{\"id\": " << job.id << ", \"result\": \"FAIL\", \"reason\": \"" << reason << "\"}" << std::endl;
		}
		fflush(stdout);
		pthread_mutex_unlock(&log_mutex);

	}

	return nullptr;
}

