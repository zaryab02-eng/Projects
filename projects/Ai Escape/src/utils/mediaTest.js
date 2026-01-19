/**
 * Media Loading Test Utility for Safari Debugging
 * Run this from browser console to test all media assets
 */

/**
 * Test if a video file loads successfully
 * @param {string} videoPath - Path to video file
 * @returns {Promise<object>} Result with status and details
 */
export const testVideo = (videoPath) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    const timeout = setTimeout(() => {
      resolve({
        path: videoPath,
        status: 'timeout',
        error: 'Video took too long to load (>10s)',
      });
    }, 10000);

    video.onloadeddata = () => {
      clearTimeout(timeout);
      resolve({
        path: videoPath,
        status: 'success',
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = (e) => {
      clearTimeout(timeout);
      resolve({
        path: videoPath,
        status: 'error',
        error: e.target.error?.message || 'Unknown video error',
        code: e.target.error?.code,
      });
    };

    video.src = videoPath;
  });
};

/**
 * Test if an audio file loads successfully
 * @param {string} audioPath - Path to audio file
 * @returns {Promise<object>} Result with status and details
 */
export const testAudio = (audioPath) => {
  return new Promise((resolve) => {
    const audio = new Audio();

    const timeout = setTimeout(() => {
      resolve({
        path: audioPath,
        status: 'timeout',
        error: 'Audio took too long to load (>5s)',
      });
    }, 5000);

    audio.onloadeddata = () => {
      clearTimeout(timeout);
      resolve({
        path: audioPath,
        status: 'success',
        duration: audio.duration,
      });
    };

    audio.onerror = (e) => {
      clearTimeout(timeout);
      resolve({
        path: audioPath,
        status: 'error',
        error: e.target.error?.message || 'Unknown audio error',
        code: e.target.error?.code,
      });
    };

    audio.src = audioPath;
  });
};

/**
 * Test all media assets in the app
 * @returns {Promise<object>} Complete test results
 */
export const testAllMedia = async () => {
  console.log('🔍 Testing all media assets...\n');

  const videos = [
    '/videos/background.mp4',
    '/videos/final.mp4',
    '/videos/level1.mp4',
    '/videos/wrong.mp4',
  ];

  const sounds = [
    '/sounds/final.mp3',
    '/sounds/unlock.mp3',
    '/sounds/wrong.mp3',
  ];

  const results = {
    videos: {},
    sounds: {},
    summary: {
      total: videos.length + sounds.length,
      passed: 0,
      failed: 0,
      timeout: 0,
    },
  };

  // Test videos
  console.log('📹 Testing videos...');
  for (const videoPath of videos) {
    const result = await testVideo(videoPath);
    results.videos[videoPath] = result;

    if (result.status === 'success') {
      console.log(`✅ ${videoPath} - OK (${result.duration.toFixed(1)}s, ${result.width}x${result.height})`);
      results.summary.passed++;
    } else if (result.status === 'timeout') {
      console.warn(`⏱️ ${videoPath} - TIMEOUT: ${result.error}`);
      results.summary.timeout++;
    } else {
      console.error(`❌ ${videoPath} - ERROR: ${result.error}`);
      results.summary.failed++;
    }
  }

  // Test audio
  console.log('\n🔊 Testing audio...');
  for (const audioPath of sounds) {
    const result = await testAudio(audioPath);
    results.sounds[audioPath] = result;

    if (result.status === 'success') {
      console.log(`✅ ${audioPath} - OK (${result.duration.toFixed(1)}s)`);
      results.summary.passed++;
    } else if (result.status === 'timeout') {
      console.warn(`⏱️ ${audioPath} - TIMEOUT: ${result.error}`);
      results.summary.timeout++;
    } else {
      console.error(`❌ ${audioPath} - ERROR: ${result.error}`);
      results.summary.failed++;
    }
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`Total: ${results.summary.total}`);
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`⏱️ Timeout: ${results.summary.timeout}`);

  if (results.summary.failed === 0 && results.summary.timeout === 0) {
    console.log('\n🎉 All media assets loaded successfully!');
  } else {
    console.warn('\n⚠️ Some media assets failed to load. Check errors above.');
  }

  return results;
};

/**
 * Test autoplay capability
 * @returns {Promise<object>} Autoplay test results
 */
export const testAutoplay = async () => {
  console.log('🎬 Testing autoplay capability...\n');

  const results = {
    video: { muted: false, unmuted: false },
    audio: false,
  };

  // Test muted video autoplay
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.src = '/videos/background.mp4';
    await video.play();
    results.video.muted = true;
    console.log('✅ Muted video autoplay: ALLOWED');
    video.pause();
  } catch (err) {
    console.warn('❌ Muted video autoplay: BLOCKED');
  }

  // Test unmuted video autoplay
  try {
    const video = document.createElement('video');
    video.muted = false;
    video.playsInline = true;
    video.src = '/videos/background.mp4';
    await video.play();
    results.video.unmuted = true;
    console.log('✅ Unmuted video autoplay: ALLOWED');
    video.pause();
  } catch (err) {
    console.warn('❌ Unmuted video autoplay: BLOCKED (expected on Safari)');
  }

  // Test audio autoplay
  try {
    const audio = new Audio('/sounds/unlock.mp3');
    await audio.play();
    results.audio = true;
    console.log('✅ Audio autoplay: ALLOWED');
    audio.pause();
  } catch (err) {
    console.warn('❌ Audio autoplay: BLOCKED (expected on Safari)');
  }

  console.log('\n📊 Autoplay Summary:');
  console.log(`Video (muted): ${results.video.muted ? '✅ Allowed' : '❌ Blocked'}`);
  console.log(`Video (unmuted): ${results.video.unmuted ? '✅ Allowed' : '❌ Blocked'}`);
  console.log(`Audio: ${results.audio ? '✅ Allowed' : '❌ Blocked'}`);

  return results;
};

/**
 * Get browser and device information
 * @returns {object} Browser details
 */
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  const info = {
    userAgent: ua,
    isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
    isIOSSafari: /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
    isChrome: /Chrome/.test(ua) && !/Edge/.test(ua),
    isFirefox: /Firefox/.test(ua),
    isMobile: /Mobile|Android|iPhone|iPad/.test(ua),
    supportsAutoplay: 'autoplay' in document.createElement('video'),
  };

  console.log('🌐 Browser Information:');
  console.log(`User Agent: ${info.userAgent}`);
  console.log(`Safari: ${info.isSafari ? '✅ Yes' : '❌ No'}`);
  console.log(`iOS Safari: ${info.isIOSSafari ? '✅ Yes' : '❌ No'}`);
  console.log(`Mobile: ${info.isMobile ? '✅ Yes' : '❌ No'}`);
  console.log(`Supports autoplay attribute: ${info.supportsAutoplay ? '✅ Yes' : '❌ No'}`);

  return info;
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('🚀 Starting Media Compatibility Tests\n');
  console.log('='.repeat(50) + '\n');

  const browserInfo = getBrowserInfo();
  console.log('\n' + '='.repeat(50) + '\n');

  const mediaResults = await testAllMedia();
  console.log('\n' + '='.repeat(50) + '\n');

  const autoplayResults = await testAutoplay();
  console.log('\n' + '='.repeat(50) + '\n');

  console.log('✅ All tests complete!');
  console.log('\nTo run individual tests:');
  console.log('- testAllMedia() - Test all media files');
  console.log('- testAutoplay() - Test autoplay capability');
  console.log('- getBrowserInfo() - Get browser details');

  return {
    browserInfo,
    mediaResults,
    autoplayResults,
  };
};

// Make available globally for console testing
if (typeof window !== 'undefined') {
  window.mediaTest = {
    testVideo,
    testAudio,
    testAllMedia,
    testAutoplay,
    getBrowserInfo,
    runAllTests,
  };
  console.log('📦 Media test utilities loaded. Run window.mediaTest.runAllTests() to test.');
}
