cmake_minimum_required(VERSION 3.2 FATAL_ERROR)
cmake_policy(VERSION 3.2)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(picspy-attempt)


find_package(OpenCV REQUIRED)

file(GLOB SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp" "${CMAKE_CURRENT_SOURCE_DIR}/lib/*.cpp")

add_executable(${PROJECT_NAME} ${SOURCES})


set(INCLUDES
  "${CMAKE_CURRENT_SOURCE_DIR}/lib"
  "${CMAKE_CURRENT_SOURCE_DIR}"
)

target_link_libraries(${PROJECT_NAME} PRIVATE ${OpenCV_LIBS} stdc++fs)

target_include_directories(${PROJECT_NAME} PUBLIC ${INCLUDES})
