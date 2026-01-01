// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "stock",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "stock",
            targets: ["stock"]
        )
    ],
    targets: [
        .target(
            name: "stock",
            path: "Sources",
            resources: [
                .process("Resources")
            ]
        )
    ]
)
