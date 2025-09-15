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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const INITIAL_LOAD_COUNT = Math.min(15, images.length);
  const LOAD_MORE_COUNT = 15;
  const columnsCount = isDesktop ? cols : 2;

  const [openImage, setOpenImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [visibleImagesCount, setVisibleImagesCount] =
    useState(INITIAL_LOAD_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({});
  const observerRef = useRef(null);
  const loaderRef = useRef(null);
  const containerRef = useRef(null);
  const previousPositionsRef = useRef({}); // Store previous positions

  const totalImages = limit ? Math.min(images.length, limit) : images.length;
  const currentVisibleCount = Math.min(visibleImagesCount, totalImages);

  const handleImageLoad = useCallback(
    (imageUrl, naturalWidth, naturalHeight) => {
      console.log(
        `Handling image load: ${imageUrl} - ${naturalWidth}x${naturalHeight}`
      );

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
          console.log(`Adding to loaded images: ${imageUrl}`);
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
      console.log(
        `Loading more images. Current: ${visibleImagesCount}, Total: ${totalImages}`
      );

      // Load the next batch
      setTimeout(() => {
        const newCount = Math.min(
          visibleImagesCount + LOAD_MORE_COUNT,
          totalImages
        );
        console.log(
          `Increasing visible images from ${visibleImagesCount} to ${newCount}`
        );
        setVisibleImagesCount(newCount);
        setIsLoading(false);
      }, 300);
    }
  }, [visibleImagesCount, totalImages, isLoading, LOAD_MORE_COUNT]);

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

  // Log loaded images for debugging
  useEffect(() => {
    console.log(`Loaded images count: ${loadedImages.length}`);
    console.log(`Current visible count: ${currentVisibleCount}`);
  }, [loadedImages.length, currentVisibleCount]);

  // Ensure all images are loaded
  useEffect(() => {
    // If we have fewer loaded images than expected, try loading more
    if (loadedImages.length < 5 && loadedImages.length < currentVisibleCount) {
      const timeoutId = setTimeout(() => {
        // Force reload images if not enough have loaded
        console.log("Forcing reload of images due to slow loading");

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
      { threshold: 0.1 }
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

    // Add extra padding to avoid unnecessary container height changes
    // that could trigger layout shifts
    return heights.length > 0 ? Math.max(...heights) + 200 + "px" : "auto";
  }, [masonryItems]);

  return (
    <>
      {loadedImages.length === 0 && (
        <Box width="100%" display="flex" justifyContent="center">
          <Grid container spacing={5}>
            {Array.from(
              { length: Math.min(12, currentVisibleCount) },
              (_, i) => (
                <Grid item key={i} xs={6} lg={3}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={0}
                    animation="wave"
                    sx={{
                      paddingTop: "75%",
                      borderRadius: 2,
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
          visibility: loadedImages.length > 0 ? "visible" : "hidden",
        }}
      >
        {images.slice(0, currentVisibleCount).map((url, id) => {
          const position = masonryItems[url] || {};
          const hasLoaded = loadedImages.includes(url);

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
                transition: hasLoaded ? "none" : "opacity 0.3s ease",
                opacity: hasLoaded ? 1 : 0,
                margin: "5px",
                transform: "translate3d(0,0,0)", // Force GPU acceleration and prevent movement
                willChange: hasLoaded ? "auto" : "opacity", // Optimize for opacity changes on loading only
              }}
            >
              <CardActionArea
                onClick={() => {
                  setOpenImage(id);
                }}
                sx={{ lineHeight: 0 }}
              >
                <Image
                  src={url}
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt={`Gallery Image ${id}`}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  // Ensure image is displayed even if it's not in the loadedImages array
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
          py={4}
          width="100%"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}

      {/* Hidden Pre-loading for the images */}
      {images.slice(0, currentVisibleCount).map((url, i) => (
        <Image
          key={`preload-${i}`}
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
            console.log(`Image loaded: ${url} - ${width}x${height}`);
          }}
          onError={() => {
            // If image fails to load, use default dimensions
            console.log(`Image load error: ${url}`);
            handleImageLoad(url, 800, 600);
          }}
          priority={i < 5} // Only set priority on first few images
          style={{ display: "none" }}
        />
      ))}
    </>
  );
}
