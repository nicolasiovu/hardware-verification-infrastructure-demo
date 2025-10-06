#pragma once
#include "test_job.hpp"
#include <queue>
#include <pthread.h>

class JobQueue {
public:
	JobQueue();
	~JobQueue();
	void push(TestJob job);
	bool pop(TestJob &job);

private:
	std::queue<TestJob> queue;
	pthread_mutex_t mutex;
};

