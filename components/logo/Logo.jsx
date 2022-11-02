import PropTypes from "prop-types";
import { forwardRef } from "react";
import NextLink from "next/link";
// @mui
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx }, ref) => {
    const logo = (
        <Box ref={ref} sx={{ width: 32, height: 32, cursor: "pointer", ...sx }}>
            <svg
                width="32"
                height="32"
                viewBox="0 0 231 273"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M65.0024 203.179C65.0024 203.179 80.4027 247.547 147.909 253.619L142.358 250.47L180.646 249.769L177.548 251.671L185.048 250.27C196.88 246.881 207.932 241.669 217.894 234.966L212.824 229.896C196.044 240.871 176.049 247.381 154.497 247.696C145.101 247.833 136.107 246.417 127.374 244.324C133.505 245.227 139.675 246.021 146.071 245.928C169.438 245.586 191.105 238.377 209.186 226.257L204.112 221.183C187.369 232.086 167.441 238.544 145.969 238.858C130.68 239.082 116.098 236.131 102.802 230.678C113.433 233.686 124.448 235.758 136.055 235.588C159.338 235.247 180.934 228.089 198.975 216.047L193.889 210.961C177.189 221.783 157.338 228.194 135.954 228.507C108.908 228.902 84.3409 219.117 65.0024 203.179V203.179Z"
                    fill="#1EC3BD"
                />
                <path
                    d="M107.899 20.1442C107.877 20.1458 107.854 20.1464 107.831 20.148L86.1266 23.8645C36.5306 37.2892 0 82.6329 0 136.453C0 138.442 0.0529014 140.417 0.153059 142.38C3.36464 191.92 38.965 222.229 38.965 222.229C26.0366 204.244 25.3279 179.774 25.3279 155.912C25.3279 95.3577 74.3417 46.3439 134.896 46.3439C161.945 46.3439 187.095 57.5127 206.199 73.7316C206.199 73.7316 188.526 21.4501 107.898 20.144L107.899 20.1442ZM116.635 26.8888C126.033 26.8888 135.607 28.2488 144.308 30.4697C138.191 29.4773 131.431 28.7784 125.035 28.7784C60.6594 28.7784 8.40094 81.0368 8.40094 145.412C8.40094 150.603 9.26429 155.556 9.92276 160.568C8.1739 152.79 7.07081 144.762 7.07081 136.453C7.07081 75.8987 56.0807 26.8888 116.635 26.8888V26.8888ZM125.035 35.8477C140.325 35.8477 154.861 39.0113 168.077 44.6579C157.491 41.4943 146.506 39.263 134.897 39.263C70.522 39.263 18.2635 91.5371 18.2635 155.912C17.8298 163.602 19.1378 169.295 20.2587 175.782C17.4489 166.079 15.4702 156.026 15.4702 145.412C15.4702 84.8576 64.4801 35.8477 125.035 35.8477V35.8477Z"
                    fill="#1EC3BD"
                />
                <path
                    d="M70.1195 67.5089C70.1195 67.5089 20.6051 83.8004 18.6273 162.962C18.6878 163.948 18.7698 165.178 18.8855 166.452L22.3047 186.42C35.7294 236.015 81.0732 272.546 134.893 272.546C136.882 272.546 138.857 272.494 140.82 272.394C190.36 269.182 217.894 234.966 217.894 234.966C199.909 247.894 178.214 247.219 154.352 247.219C93.7979 247.219 44.7841 198.205 44.7841 137.65C44.7841 110.602 53.9005 86.6123 70.1194 67.5089L70.1195 67.5089ZM43.0981 104.471C39.9345 115.057 37.7031 126.041 37.7032 137.65C37.7032 202.026 89.9774 254.284 154.353 254.284C161.159 254.284 167.735 253.41 174.223 252.289C164.52 255.099 154.466 257.077 143.852 257.077C83.2977 257.077 34.2878 208.067 34.2878 147.513C34.2878 132.223 37.4515 117.686 43.0981 104.471V104.471ZM29.0963 128.84C28.104 134.958 27.2185 141.117 27.2185 147.513C27.2185 211.888 79.477 264.147 143.852 264.147C149.043 264.147 153.996 263.283 159.008 262.625C151.23 264.374 143.203 265.477 134.893 265.477C74.3389 265.477 25.3289 216.467 25.3289 155.912C25.3289 146.515 26.8755 137.542 29.0963 128.84V128.84Z"
                    fill="#5D2589"
                    fill-opacity="0.992157"
                />
                <path
                    d="M143.837 0.0198975C71.7944 0.56596 40.4417 48.1788 40.4417 48.1788C59.7802 32.2412 90.1414 25.4173 117.187 25.8129C154.298 26.3558 186.8 45.2485 206.201 73.7332L211.251 68.6786C190.5 38.9674 156.257 19.302 117.289 18.7318C105.681 18.562 94.6658 20.6332 84.0351 23.6416C97.3314 18.189 111.914 15.2376 127.202 15.4613C164.401 16.0055 196.965 34.9848 216.349 63.5811L221.407 58.5265C200.67 28.7081 166.36 8.96335 127.304 8.39195C120.909 8.29837 114.735 9.09314 108.604 9.99596C117.337 7.90262 126.334 6.48618 135.731 6.62366C173.009 7.16904 205.634 26.2327 225.003 54.9312L230.061 49.8728C214.925 28.0255 192.509 11.5636 166.277 4.04944L145.531 0.184209L143.837 0.0198975Z"
                    fill="#5D2589"
                    fill-opacity="0.992157"
                />
                <path
                    d="M164.888 7.84451L170.665 5.58947C170.665 5.58947 161.233 1.58408 144.336 0.144544C127.439 -1.295 98.0012 8.49226 98.0012 8.49226L134.877 5.18904L164.888 7.84451Z"
                    fill="#5D2589"
                    fill-opacity="0.992157"
                />
                <path
                    d="M22.3048 186.42C22.3048 186.42 19.3512 172.391 18.8856 166.452C18.3609 159.761 20.956 156.726 20.956 156.726L25.5773 179.659L22.3048 186.42Z"
                    fill="#5D2589"
                    fill-opacity="0.992157"
                />
            </svg>
        </Box>
    );

    if (disabledLink) {
        return <>{logo}</>;
    }

    return <NextLink href="/">{logo}</NextLink>;
});

Logo.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};

export default Logo;
