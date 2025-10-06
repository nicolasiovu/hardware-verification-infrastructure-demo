#include "job_queue.hpp"
#include "test_job.hpp"
#include <pthread.h>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <iostream>

extern void *worker_thread(void *);

int main() {
	srand(time(nullptr));
	JobQueue queue;

	const int NUM_THREADS = 12;
	const int NUM_JOBS = 10000;

	for (int i = 0; i < NUM_JOBS; i++) {
		TestJob job;
		job.id = i;
		job.randVal = rand() % 100;
		queue.push(job);
	}

	std::vector<pthread_t> threads(NUM_THREADS);

	for (auto &thread: threads) {
		pthread_create(&thread, nullptr, worker_thread, &queue);
	}

	for (auto &thread: threads) {
		pthread_join(thread, nullptr);
	}

	std::cout << "All tests completed." << '\n';
	return 0;
}
