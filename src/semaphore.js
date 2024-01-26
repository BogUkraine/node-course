class Semaphore {
    allowedParallelThreads = 0

    activeWorkers = 0

    constructor(allowedParallelThreads = 1) {
        this.allowedParallelThreads = allowedParallelThreads
    }

    isFreeSlot() {
        return this.activeWorkers < this.allowedParallelThreads
    }

    takeFreeSlot() {
        if (this.isFreeSlot()) this.activeWorkers += 1
    }

    releaseSlot() {
        if (this.activeWorkers) this.activeWorkers -= 1
    }
}

module.exports = Semaphore
