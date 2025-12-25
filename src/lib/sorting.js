/**
 * Comprehensive Sorting Utilities for Gym Website
 * Includes various sorting algorithms and data type handlers
 */

// Quick Sort Algorithm - Efficient for large datasets
export function quickSort(arr, compareFunction) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];
  
  for (let element of arr) {
    const comparison = compareFunction(element, pivot);
    if (comparison < 0) left.push(element);
    else if (comparison > 0) right.push(element);
    else equal.push(element);
  }
  
  return [...quickSort(left, compareFunction), ...equal, ...quickSort(right, compareFunction)];
}

// Merge Sort Algorithm - Stable sorting for consistent results
export function mergeSort(arr, compareFunction) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFunction);
  const right = mergeSort(arr.slice(mid), compareFunction);
  
  return merge(left, right, compareFunction);
}

function merge(left, right, compareFunction) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (compareFunction(left[leftIndex], right[rightIndex]) <= 0) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Heap Sort Algorithm - Good for memory-constrained environments
export function heapSort(arr, compareFunction) {
  const sortedArray = [...arr];
  
  // Build max heap
  for (let i = Math.floor(sortedArray.length / 2) - 1; i >= 0; i--) {
    heapify(sortedArray, sortedArray.length, i, compareFunction);
  }
  
  // Extract elements from heap one by one
  for (let i = sortedArray.length - 1; i > 0; i--) {
    [sortedArray[0], sortedArray[i]] = [sortedArray[i], sortedArray[0]];
    heapify(sortedArray, i, 0, compareFunction);
  }
  
  return sortedArray;
}

function heapify(arr, n, i, compareFunction) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && compareFunction(arr[left], arr[largest]) > 0) {
    largest = left;
  }
  
  if (right < n && compareFunction(arr[right], arr[largest]) > 0) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest, compareFunction);
  }
}

// Comparison functions for different data types
export const compareFunctions = {
  // String comparison (case-insensitive)
  string: (a, b, key) => {
    const aVal = (key ? a[key] : a)?.toString().toLowerCase() || '';
    const bVal = (key ? b[key] : b)?.toString().toLowerCase() || '';
    return aVal.localeCompare(bVal);
  },
  
  // Number comparison
  number: (a, b, key) => {
    const aVal = key ? a[key] : a;
    const bVal = key ? b[key] : b;
    return (aVal || 0) - (bVal || 0);
  },
  
  // Date comparison
  date: (a, b, key) => {
    const aVal = new Date(key ? a[key] : a);
    const bVal = new Date(key ? b[key] : b);
    return aVal - bVal;
  },
  
  // Boolean comparison
  boolean: (a, b, key) => {
    const aVal = key ? a[key] : a;
    const bVal = key ? b[key] : b;
    return (aVal === bVal) ? 0 : aVal ? 1 : -1;
  },
  
  // Email comparison (domain-aware)
  email: (a, b, key) => {
    const aVal = (key ? a[key] : a)?.toString().toLowerCase() || '';
    const bVal = (key ? b[key] : b)?.toString().toLowerCase() || '';
    
    // First sort by domain, then by local part
    const aDomain = aVal.split('@')[1] || '';
    const bDomain = bVal.split('@')[1] || '';
    
    if (aDomain !== bDomain) {
      return aDomain.localeCompare(bDomain);
    }
    
    return aVal.localeCompare(bVal);
  }
};

// Main sorting function with algorithm selection
export function sortData(data, sortConfig, algorithm = 'quickSort') {
  if (!data || !Array.isArray(data) || data.length <= 1) return data;
  if (!sortConfig || !sortConfig.key) return data;
  
  const { key, direction = 'asc', type = 'string' } = sortConfig;
  
  // Get the appropriate comparison function
  const baseCompareFunction = compareFunctions[type] || compareFunctions.string;
  
  // Create comparison function with direction
  const compareFunction = (a, b) => {
    const result = baseCompareFunction(a, b, key);
    return direction === 'desc' ? -result : result;
  };
  
  // Select sorting algorithm
  switch (algorithm) {
    case 'mergeSort':
      return mergeSort(data, compareFunction);
    case 'heapSort':
      return heapSort(data, compareFunction);
    case 'quickSort':
    default:
      return quickSort(data, compareFunction);
  }
}

// Multi-column sorting
export function multiSort(data, sortConfigs, algorithm = 'quickSort') {
  if (!data || !Array.isArray(data) || data.length <= 1) return data;
  if (!sortConfigs || !Array.isArray(sortConfigs) || sortConfigs.length === 0) return data;
  
  const compareFunction = (a, b) => {
    for (const config of sortConfigs) {
      const { key, direction = 'asc', type = 'string' } = config;
      const baseCompareFunction = compareFunctions[type] || compareFunctions.string;
      const result = baseCompareFunction(a, b, key);
      
      if (result !== 0) {
        return direction === 'desc' ? -result : result;
      }
    }
    return 0;
  };
  
  // Select sorting algorithm
  switch (algorithm) {
    case 'mergeSort':
      return mergeSort(data, compareFunction);
    case 'heapSort':
      return heapSort(data, compareFunction);
    case 'quickSort':
    default:
      return quickSort(data, compareFunction);
  }
}

// Search and sort combination
export function searchAndSort(data, searchTerm, searchKeys, sortConfig, algorithm = 'quickSort') {
  if (!data || !Array.isArray(data)) return data;
  
  let filteredData = data;
  
  // Apply search filter if search term is provided
  if (searchTerm && searchKeys && searchKeys.length > 0) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    filteredData = data.filter(item => 
      searchKeys.some(key => {
        const value = item[key]?.toString().toLowerCase() || '';
        return value.includes(lowerSearchTerm);
      })
    );
  }
  
  // Apply sorting if sort config is provided
  if (sortConfig && sortConfig.key) {
    return sortData(filteredData, sortConfig, algorithm);
  }
  
  return filteredData;
}

// Performance benchmarking utility
export function benchmarkSorting(data, sortConfig) {
  const algorithms = ['quickSort', 'mergeSort', 'heapSort'];
  const results = {};
  
  algorithms.forEach(algorithm => {
    const start = performance.now();
    sortData([...data], sortConfig, algorithm);
    const end = performance.now();
    results[algorithm] = end - start;
  });
  
  return results;
}

// Utility to detect optimal algorithm based on data size and type
export function getOptimalAlgorithm(dataSize, dataType = 'mixed') {
  // Quick sort for general purpose and large datasets
  if (dataSize > 1000) return 'quickSort';
  
  // Merge sort for stability requirements or nearly sorted data
  if (dataType === 'string' || dataSize > 100) return 'mergeSort';
  
  // Heap sort for memory-constrained environments
  return 'heapSort';
}