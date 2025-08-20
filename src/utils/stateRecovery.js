// Redux State Recovery Utility
// Helps detect and recover from corrupted Redux persist state

export const detectStateCorruption = () => {
  try {
    const persistKeys = Object.keys(localStorage).filter(key => key.startsWith('persist:'));
    
    for (const key of persistKeys) {
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      try {
        JSON.parse(value);
      } catch (parseError) {
        console.error(`Corrupted state detected in ${key}:`, parseError);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error detecting state corruption:', error);
    return false;
  }
};

export const markStateAsCorrupted = () => {
  try {
    localStorage.setItem('redux-state-corrupted', 'true');
    console.log('State marked as corrupted for next app load');
  } catch (error) {
    console.error('Error marking state as corrupted:', error);
  }
};

export const clearCorruptedState = () => {
  try {
    console.log('🔧 Clearing corrupted Redux state...');
    
    // Clear all persist keys
    const keys = Object.keys(localStorage).filter(key => key.startsWith('persist:'));
    keys.forEach(key => {
      console.log(`Clearing: ${key}`);
      localStorage.removeItem(key);
    });
    
    // Clear the corruption flag
    localStorage.removeItem('redux-state-corrupted');
    
    console.log('✅ Corrupted state cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing corrupted state:', error);
    return false;
  }
};

export const validateReduxState = (state) => {
  try {
    // Basic validation - check if state is an object and has expected structure
    if (!state || typeof state !== 'object') {
      return false;
    }
    
    // Add more specific validation based on your Redux store structure
    // For example, check if required slices exist
    const requiredSlices = ['auth']; // Add your required slice names here
    
    for (const slice of requiredSlices) {
      if (!(slice in state)) {
        console.warn(`Missing required slice: ${slice}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error validating Redux state:', error);
    return false;
  }
};

// Recovery strategies
export const recoverFromCorruption = () => {
  console.log('🔄 Attempting state recovery...');
  
  if (detectStateCorruption()) {
    clearCorruptedState();
    
    // Optionally reload the page to start fresh
    if (window.confirm('State corruption detected. Reload the page to start fresh?')) {
      window.location.reload();
    }
    
    return true;
  }
  
  return false;
};

// Export a function to run state health check
export const runStateHealthCheck = () => {
  console.log('🏥 Running Redux state health check...');
  
  const isCorrupted = detectStateCorruption();
  
  if (isCorrupted) {
    console.warn('⚠️ State corruption detected');
    markStateAsCorrupted();
    return false;
  }
  
  console.log('✅ Redux state is healthy');
  return true;
};
