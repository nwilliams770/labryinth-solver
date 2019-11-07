let queue = [],
    interval = null,
    lastTick = null,
    lastInterval = null;

function enqueue(fn) {
    queue.push(fn);
};

function processQueue() {
    let fn = queue.shift();
    if (fn) setImmediate(fn);
};