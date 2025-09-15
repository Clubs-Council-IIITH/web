"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";

import {
  Box,
  Grid,
  Skeleton,
  Card,
  CardActionArea,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ImageModal from "components/ImageModal";

export default function ImageMasonry({ images, limit = undefined, cols = 4 }) {
  images = useMemo(() => {
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [images]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const INITIAL_LOAD_COUNT = Math.min(15, images.length);
  const LOAD_MORE_COUNT = 15;
  const PRELOAD_TRIGGER_COUNT = 5; // Start preloading when 5 images are loaded
  const PRELOAD_BATCH_SIZE = 10; // Preload 20 images at a time
  const columnsCount = isDesktop ? cols : 2;

  const [openImage, setOpenImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [preloadedImages, setPreloadedImages] = useState([]); // Track preloaded images
  const [visibleImagesCount, setVisibleImagesCount] =
    useState(INITIAL_LOAD_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({});
  const observerRef = useRef(null);
  const loaderRef = useRef(null);
  const containerRef = useRef(null);
  const previousPositionsRef = useRef({}); // Store previous positions
  const preloadStartIndexRef = useRef(INITIAL_LOAD_COUNT); // Track where preloading should start

  const totalImages = limit ? Math.min(images.length, limit) : images.length;
  const currentVisibleCount = Math.min(visibleImagesCount, totalImages);

  const handleImageLoad = useCallback(
    (imageUrl, naturalWidth, naturalHeight) => {
      // console.log(
      //   `Handling image load: ${imageUrl} - ${naturalWidth}x${naturalHeight}`
      // );

      // Ensure we have valid dimensions
      if (naturalWidth && naturalHeight) {
        setImageDimensions((prev) => ({
          ...prev,
          [imageUrl]: { width: naturalWidth, height: naturalHeight },
        }));
      } else {
        // Use default dimensions if not available
        setImageDimensions((prev) => ({
          ...prev,
          [imageUrl]: { width: 800, height: 600 },
        }));
      }

      setLoadedImages((prev) => {
        if (!prev.includes(imageUrl)) {
          // console.log(`Adding to loaded images: ${imageUrl}`);
          return [...prev, imageUrl];
        }
        return prev;
      });
    },
    []
  );

  const handlePreloadedImage = useCallback(
    (imageUrl, naturalWidth, naturalHeight) => {
      // console.log(
      //   `Preloaded image: ${imageUrl} - ${naturalWidth}x${naturalHeight}`
      // );

      // Store dimensions for preloaded images
      if (naturalWidth && naturalHeight) {
        setImageDimensions((prev) => ({
          ...prev,
          [imageUrl]: { width: naturalWidth, height: naturalHeight },
        }));
      } else {
        setImageDimensions((prev) => ({
          ...prev,
          [imageUrl]: { width: 800, height: 600 },
        }));
      }

      setPreloadedImages((prev) => {
        if (!prev.includes(imageUrl)) {
          return [...prev, imageUrl];
        }
        return prev;
      });
    },
    []
  );

  const loadMoreImages = useCallback(() => {
    if (visibleImagesCount < totalImages && !isLoading) {
      setIsLoading(true);
      // console.log(
      //   `Loading more images. Current: ${visibleImagesCount}, Total: ${totalImages}`
      // );

      // Load the next batch immediately
      const newCount = Math.min(
        visibleImagesCount + LOAD_MORE_COUNT,
        totalImages
      );
      // console.log(
      //   `Increasing visible images from ${visibleImagesCount} to ${newCount}`
      // );
      setVisibleImagesCount(newCount);
      setIsLoading(false);
    }
  }, [visibleImagesCount, totalImages, isLoading, LOAD_MORE_COUNT]);

  // Auto-load more images when most of the current batch is loaded
  useEffect(() => {
    // If at least 70% of the current visible images are loaded, automatically load more
    const currentlyVisibleUrls = images.slice(0, currentVisibleCount);
    const loadedVisibleCount = currentlyVisibleUrls.filter(
      (url) => loadedImages.includes(url) || preloadedImages.includes(url)
    ).length;

    const loadedPercentage =
      currentlyVisibleUrls.length > 0
        ? (loadedVisibleCount / currentlyVisibleUrls.length) * 100
        : 0;

    if (
      loadedPercentage >= 70 &&
      currentVisibleCount < totalImages &&
      !isLoading
    ) {
      // console.log(
      //   `${loadedPercentage.toFixed(
      //     1
      //   )}% of visible images loaded, auto-loading more`
      // );
      loadMoreImages();
    }
  }, [
    loadedImages.length,
    preloadedImages.length,
    currentVisibleCount,
    totalImages,
    isLoading,
    loadMoreImages,
    images,
  ]);
  useEffect(() => {
    const shouldStartPreloading =
      loadedImages.length >= PRELOAD_TRIGGER_COUNT &&
      !isPreloading &&
      preloadStartIndexRef.current < totalImages;

    if (shouldStartPreloading) {
      setIsPreloading(true);
      // console.log(
      //   `Starting preload from index ${preloadStartIndexRef.current}`
      // );

      const preloadEndIndex = Math.min(
        preloadStartIndexRef.current + PRELOAD_BATCH_SIZE,
        totalImages
      );

      // Update the start index for next preload batch
      preloadStartIndexRef.current = preloadEndIndex;

      // Reset preloading state after a short delay to allow the next batch
      setTimeout(() => {
        setIsPreloading(false);
      }, 1000);
    }
  }, [
    loadedImages.length,
    isPreloading,
    totalImages,
    PRELOAD_TRIGGER_COUNT,
    PRELOAD_BATCH_SIZE,
  ]);

  // Advanced preloading - start preloading next batch when approaching current visible limit
  useEffect(() => {
    // Always be preloading ahead of what's visible
    if (!isPreloading && preloadStartIndexRef.current < totalImages) {
      setIsPreloading(true);
      // console.log(
      //   `Advance preloading from index ${preloadStartIndexRef.current}`
      // );

      const preloadEndIndex = Math.min(
        preloadStartIndexRef.current + PRELOAD_BATCH_SIZE,
        totalImages
      );

      // Update the start index for next preload batch
      preloadStartIndexRef.current = preloadEndIndex;

      // Reset preloading state after a short delay
      setTimeout(() => {
        setIsPreloading(false);
      }, 500); // Reduced to 500ms to allow more frequent preloading
    }
  }, [
    preloadedImages.length, // Trigger when new images are preloaded
    currentVisibleCount, // Trigger when visible count changes
    isPreloading,
    totalImages,
    PRELOAD_BATCH_SIZE,
  ]);

  // Calculate masonry layout
  const masonryItems = useMemo(() => {
    if (containerRef.current && Object.keys(imageDimensions).length > 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const columnWidth = containerWidth / columnsCount;
      const columnHeights = Array(columnsCount).fill(0);
      const positions = {};

      // First handle already loaded images to maintain stability
      images.slice(0, currentVisibleCount).forEach((url) => {
        if (imageDimensions[url] && loadedImages.includes(url)) {
          // If we have this position already calculated in a previous render, use it
          if (previousPositionsRef.current[url]) {
            positions[url] = previousPositionsRef.current[url];

            // Update column heights based on stable positions
            const pos = previousPositionsRef.current[url];
            if (
              pos.column !== undefined &&
              pos.top !== undefined &&
              pos.height !== undefined
            ) {
              const bottomPosition = pos.top + pos.height + 10; // 10px for gap
              if (columnHeights[pos.column] < bottomPosition) {
                columnHeights[pos.column] = bottomPosition;
              }
            }
          }
        }
      });

      // Then calculate positions for new images
      images.slice(0, currentVisibleCount).forEach((url) => {
        // Skip if already positioned
        if (positions[url]) return;

        if (imageDimensions[url]) {
          // Find the shortest column
          const shortestColumn = columnHeights.indexOf(
            Math.min(...columnHeights)
          );

          // Calculate aspect ratio and image height
          const { width, height } = imageDimensions[url];
          const aspectRatio = width / height;
          const imageHeight = columnWidth / aspectRatio;

          // Store position
          positions[url] = {
            column: shortestColumn,
            top: columnHeights[shortestColumn],
            height: imageHeight,
          };

          // Update column height
          columnHeights[shortestColumn] += imageHeight + 10; // 10px for gap
        }
      });

      // Update the ref with current positions for the next render
      previousPositionsRef.current = { ...positions };

      return positions;
    }
    return {};
  }, [
    images,
    currentVisibleCount,
    imageDimensions,
    columnsCount,
    loadedImages,
  ]);

  // // Log loaded images for debugging
  // useEffect(() => {
  //   console.log(`Loaded images count: ${loadedImages.length}`);
  //   console.log(`Preloaded images count: ${preloadedImages.length}`);
  //   console.log(`Current visible count: ${currentVisibleCount}`);
  // }, [loadedImages.length, preloadedImages.length, currentVisibleCount]);

  // Ensure all images are loaded
  useEffect(() => {
    // If we have fewer loaded images than expected, try loading more
    if (loadedImages.length < 5 && loadedImages.length < currentVisibleCount) {
      const timeoutId = setTimeout(() => {
        // Force reload images if not enough have loaded
        // console.log("Forcing reload of images due to slow loading");

        // Add images that failed to load to the loadedImages array with default dimensions
        const failedImages = images
          .slice(0, currentVisibleCount)
          .filter((url) => !loadedImages.includes(url));

        failedImages.forEach((url) => {
          handleImageLoad(url, 800, 600);
        });
      }, 5000); // Wait 5 seconds before forcing

      return () => clearTimeout(timeoutId);
    }
  }, [loadedImages.length, currentVisibleCount, images, handleImageLoad]);

  // Setup intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px 0px", // Start loading 200px before the element is visible
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreImages]);

  // Attach observer to loader element
  useEffect(() => {
    const currentLoaderRef = loaderRef.current;
    const currentObserver = observerRef.current;

    if (currentLoaderRef && currentObserver) {
      currentObserver.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef && currentObserver) {
        currentObserver.unobserve(currentLoaderRef);
      }
    };
  }, [loadedImages, visibleImagesCount]);

  // Automatically show more images when enough are preloaded
  useEffect(() => {
    // If we have preloaded images that aren't yet visible, increase visible count
    const preloadedButNotVisible = preloadedImages.filter(
      (url) => images.indexOf(url) >= visibleImagesCount
    );

    if (preloadedButNotVisible.length > 0 && !isLoading) {
      // console.log(
      //   `Found ${preloadedButNotVisible.length} preloaded images that are not yet visible`
      // );

      // Show more images without requiring scroll
      const newVisibleCount = Math.min(
        visibleImagesCount + LOAD_MORE_COUNT,
        totalImages
      );

      if (newVisibleCount > visibleImagesCount) {
        // console.log(
        //   `Auto-increasing visible images from ${visibleImagesCount} to ${newVisibleCount}`
        // );
        setVisibleImagesCount(newVisibleCount);
      }
    }
  }, [
    preloadedImages,
    visibleImagesCount,
    images,
    isLoading,
    totalImages,
    LOAD_MORE_COUNT,
  ]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Only force recalculation if we have very few loaded images
      // This prevents recalculation for already displayed images
      if (containerRef.current && loadedImages.length < 5) {
        containerRef.current.style.height = "auto";
        // Trigger a reflow to recalculate positions
        setTimeout(() => {
          setImageDimensions((prev) => ({ ...prev }));
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [loadedImages.length]);

  // Calculate container height
  const containerHeight = useMemo(() => {
    if (Object.keys(masonryItems).length === 0) return "auto";

    const heights = [];
    Object.values(masonryItems).forEach((item) => {
      heights.push(item.top + item.height);
    });

    // Add just enough padding to avoid layout shifts, but not too much to cause scrollbars
    return heights.length > 0 ? Math.max(...heights) + 50 + "px" : "auto";
  }, [masonryItems]);

  // Get the range of images to preload
  const getPreloadRange = () => {
    // First ensure we're preloading images that will be visible next
    // (i.e., the ones right after the currently visible ones)
    const nextBatchStart = currentVisibleCount;
    const nextBatchEnd = Math.min(
      nextBatchStart + PRELOAD_BATCH_SIZE,
      totalImages
    );

    // If we've already preloaded all the next batch images, look ahead further
    if (
      nextBatchStart < nextBatchEnd &&
      images
        .slice(nextBatchStart, nextBatchEnd)
        .every((url) => preloadedImages.includes(url))
    ) {
      // Look further ahead - go to where preloadStartIndexRef is pointing
      const furtherStart = Math.max(nextBatchEnd, preloadStartIndexRef.current);
      const furtherEnd = Math.min(
        furtherStart + PRELOAD_BATCH_SIZE,
        totalImages
      );
      return { start: furtherStart, end: furtherEnd };
    }

    return { start: nextBatchStart, end: nextBatchEnd };
  };

  const preloadRange = getPreloadRange();

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden", // Prevent horizontal overflow
      }}
    >
      {/* Initial loading skeleton - only shows when no images are loaded yet */}
      {loadedImages.length === 0 && (
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          mb={4}
          overflow="hidden"
        >
          <Grid container spacing={2}>
            {Array.from(
              { length: Math.min(INITIAL_LOAD_COUNT, currentVisibleCount) },
              (_, i) => (
                <Grid item key={i} xs={6} lg={12 / columnsCount}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={0}
                    animation="wave"
                    sx={{
                      paddingTop: `${75 + Math.floor(Math.random() * 30)}%`, // Varying heights
                      borderRadius: 2,
                      transform: "scale(1)", // Prevents the default skeleton scale animation
                    }}
                  />
                </Grid>
              )
            )}
          </Grid>
        </Box>
      )}

      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",
          height: containerHeight,
          margin: "0 auto",
          visibility: "visible", // Always visible to show skeletons
          overflow: "hidden", // Prevent overflow from causing scrollbars
        }}
      >
        {images.slice(0, currentVisibleCount).map((url, id) => {
          const position = masonryItems[url] || {};
          const hasLoaded = loadedImages.includes(url);
          const isPreloaded = preloadedImages.includes(url);
          const isImageReady = hasLoaded || isPreloaded;

          // Handle default positions for items that don't have calculated positions yet
          let top = 0;
          let left = 0;

          if (position.top !== undefined) {
            top = position.top;
          } else if (id > 0) {
            // Basic fallback positioning if we don't have calculated positions
            const rowIndex = Math.floor(id / columnsCount);
            top = rowIndex * 300; // Rough estimate for height
          }

          if (position.column !== undefined) {
            left = position.column * (100 / columnsCount);
          } else {
            // Fallback to grid-like layout
            left = (id % columnsCount) * (100 / columnsCount);
          }

          return (
            <Card
              key={`card-${id}`}
              variant="outlined"
              component="div"
              sx={{
                position: "absolute",
                top: `${top}px`,
                left: `${left}%`,
                width: `calc(${100 / columnsCount}% - 10px)`,
                lineHeight: 0,
                display: "block",
                overflow: "hidden",
                boxShadow: `0px 4px 6px ${theme.palette.primary.dark}80`,
                transition: "transform 0.2s ease",
                margin: "5px",
                transform: "translate3d(0,0,0)", // Force GPU acceleration
                willChange: "transform", // Optimize for transforms
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardActionArea
                onClick={() => {
                  if (isImageReady) {
                    setOpenImage(id);
                  }
                }}
                sx={{
                  lineHeight: 0,
                  position: "relative",
                  cursor: isImageReady ? "pointer" : "default",
                }}
              >
                {/* Skeleton that shows while image is loading */}
                {!isImageReady && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={0}
                    animation="wave"
                    sx={{
                      paddingTop: position.height
                        ? `${
                            (position.height /
                              (((100 / columnsCount) *
                                containerRef.current?.offsetWidth) /
                                100)) *
                            100
                          }%`
                        : "75%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                      borderRadius: 0,
                    }}
                  />
                )}

                {/* The actual image - always render but control visibility */}
                <Image
                  src={url}
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt={`Gallery Image ${id}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    opacity: isImageReady ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    position: "relative",
                    zIndex: 2,
                  }}
                  onLoad={(e) => {
                    if (
                      !loadedImages.includes(url) &&
                      e.target.naturalWidth &&
                      e.target.naturalHeight
                    ) {
                      handleImageLoad(
                        url,
                        e.target.naturalWidth,
                        e.target.naturalHeight
                      );
                    }
                  }}
                />
              </CardActionArea>
            </Card>
          );
        })}
      </Box>

      <ImageModal
        images={images}
        id={openImage}
        onClose={() => setOpenImage(null)}
      />

      {/* Loading indicator for more images */}
      {visibleImagesCount < totalImages && (
        <Box
          ref={loaderRef}
          display="flex"
          justifyContent="center"
          alignItems="center"
          py={3}
          mt={2}
          width="100%"
          sx={{
            overflow: "hidden",
            height: "60px", // Fixed height to prevent layout shifts
          }}
        >
          <CircularProgress color="primary" size={36} />
          {isPreloading && (
            <Box ml={2} fontSize="0.875rem" color="text.secondary">
              Preloading images...
            </Box>
          )}
        </Box>
      )}

      {/* Hidden Pre-loading for the currently visible images */}
      {images.slice(0, currentVisibleCount).map((url, i) => (
        <Image
          key={`preload-visible-${i}`}
          src={url}
          width={0}
          height={0}
          sizes="100vw"
          alt={`hidden-img-${i}`}
          onLoad={(e) => {
            // Ensure we have valid dimensions
            const width = e.target.naturalWidth || 800; // Default width if not available
            const height = e.target.naturalHeight || 600; // Default height if not available
            handleImageLoad(url, width, height);
          }}
          onError={() => {
            // If image fails to load, use default dimensions
            console.log(`Image load error: ${url}`);
            handleImageLoad(url, 800, 600);
          }}
          priority={i < 10} // Increase priority images count for better initial loading
          style={{ display: "none" }}
        />
      ))}

      {/* Hidden Pre-loading for upcoming images */}
      {preloadRange.start < preloadRange.end &&
        images.slice(preloadRange.start, preloadRange.end).map((url, i) => {
          const actualIndex = preloadRange.start + i;
          return (
            <Image
              key={`preload-upcoming-${actualIndex}`}
              src={url}
              width={0}
              height={0}
              sizes="100vw"
              alt={`preload-img-${actualIndex}`}
              onLoad={(e) => {
                const width = e.target.naturalWidth || 800;
                const height = e.target.naturalHeight || 600;
                handlePreloadedImage(url, width, height);
              }}
              onError={() => {
                console.log(`Preload image error: ${url}`);
                handlePreloadedImage(url, 800, 600);
              }}
              // Increase loading importance for next batch
              fetchPriority="high"
              style={{ display: "none" }}
            />
          );
        })}
    </Box>
  );
}
