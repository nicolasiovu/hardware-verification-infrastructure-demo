#include "job_queue.hpp"

JobQueue::JobQueue() {
	pthread_mutex_init(&mutex, nullptr);	
}

JobQueue::~JobQueue() {
	pthread_mutex_destroy(&mutex);
}

void JobQueue::push(TestJob job) {
	pthread_mutex_lock(&mutex);
	
	queue.push(job);
	
	pthread_mutex_unlock(&mutex);
}

bool JobQueue::pop(TestJob &job) {
	pthread_mutex_lock(&mutex);

	if (queue.empty()) {
		pthread_mutex_unlock(&mutex);
		return false;
	}

	job = queue.front();
	queue.pop();

	pthread_mutex_unlock(&mutex);
	return true;
}

