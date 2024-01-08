class HashMap {
  constructor(hashFunction, initialCapacity = 16, loadFactor = 0.75) {
    if (typeof hashFunction !== "function") {
      throw new Error("Hash function must be a function");
    }

    this.hashFunction = hashFunction; // Assign the function itself, not the result of invoking it
    this.loadFactor = loadFactor;
    this.buckets = new Array(initialCapacity).fill(null);
    this.size = 0;
  }

  hash(key) {
    const index = this.hashFunction(key, this.buckets.length);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
    return index;
  }

  set(key, value) {
    const index = this.hash(key);

    if (this.buckets[index] === null) {
      this.buckets[index] = [];
    }

    const bucket = this.buckets[index];
    const existingEntry = bucket.find((entry) => entry.key === key);

    if (existingEntry) {
      existingEntry.value = value;
    } else {
      bucket.push({ key, value });
      this.size++;

      // Check if we need to resize the buckets
      if (this.size / this.buckets.length > this.loadFactor) {
        this.resizeBuckets();
      }
    }

    return this;
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (bucket) {
      const entry = bucket.find((entry) => entry.key === key);
      return entry ? entry.value : null;
    }

    return null;
  }

  has(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    return !!bucket && bucket.some((entry) => entry.key === key);
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (bucket) {
      const entryIndex = bucket.findIndex((entry) => entry.key === key);

      if (entryIndex !== -1) {
        const removedEntry = bucket.splice(entryIndex, 1)[0];
        this.size--;
        return removedEntry.value;
      }
    }

    return null;
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets = new Array(this.buckets.length).fill(null);
    this.size = 0;
    return this;
  }

  keys() {
    return this.buckets.reduce((keys, bucket) => {
      if (bucket) {
        bucket.forEach((entry) => keys.push(entry.key));
      }
      return keys;
    }, []);
  }

  values() {
    return this.buckets.reduce((values, bucket) => {
      if (bucket) {
        bucket.forEach((entry) => values.push(entry.value));
      }
      return values;
    }, []);
  }

  entries() {
    return this.buckets.reduce((entries, bucket) => {
      if (bucket) {
        bucket.forEach((entry) => entries.push([entry.key, entry.value]));
      }
      return entries;
    }, []);
  }

  resizeBuckets() {
    const newCapacity = this.buckets.length * 2;
    const newBuckets = new Array(newCapacity).fill(null);

    this.buckets.forEach((bucket) => {
      if (bucket) {
        bucket.forEach((entry) => {
          const index = this.hash(entry.key, newCapacity);
          if (newBuckets[index] === null) {
            newBuckets[index] = [];
          }
          newBuckets[index].push({ key: entry.key, value: entry.value });
        });
      }
    });

    this.buckets = newBuckets;
  }
}

function hashFunction(string, arrayLength) {
  let hashCode = 0;

  const primeNumber = 31;
  for (let i = 0; i < string.length; i++) {
    hashCode = primeNumber * hashCode + string.charCodeAt(i);
  }

  // Ensure the index is within bounds
  return Math.abs(hashCode) % arrayLength;
}

// Example usage:
const myHashMap = new HashMap((key) =>
  hashFunction(key, myHashMap.buckets.length),
);
myHashMap.set("name", "John");
myHashMap.set("age", 25);
console.log(myHashMap.get("name")); // Output: John
console.log(myHashMap.has("age")); // Output: true
myHashMap.remove("age");
console.log(myHashMap.length()); // Output: 1
console.log(myHashMap.keys()); // Output: ['name']
console.log(myHashMap.values()); // Output: ['John']
console.log(myHashMap.entries()); // Output: [['name', 'John']]
