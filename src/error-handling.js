const terminate = (options = { coredump: false, timeout: 500 }) => {
    const exit = (code) => {
        if (options.coredump) {
            process.abort()
        } else {
            process.exit(code)
        }
    }

    return (code, reason, workerThreads) => (err) => {
        if (err && err instanceof Error) {
            console.log(reason, err.message, err.stack)
        }

        workerThreads.forEach((worker) => worker.terminate())
        setTimeout(() => exit(code), options.timeout).unref()
    }
}

const exitHandler = terminate({
    coredump: false,
    timeout: 500,
})

module.exports = { exitHandler }
